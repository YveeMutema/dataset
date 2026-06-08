package com.ruralhealth;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.CSVLoader;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.*;

public class PredictService {
    private static final String MODEL_FILE = "data/model.bin";
    private static final String[] TRAIN_FILES = {
            "data/train.csv",
            "data/Training.csv",
            "Training.csv",
            "../Training.csv"
    };
    private static final int PORT = 9000;
    private static final Gson gson = new Gson();
    private final Classifier model;
    private final Instances template;

    public PredictService(Classifier model, Instances template) {
        this.model = model;
        this.template = template;
    }

    public static void main(String[] args) throws Exception {
        Classifier model = loadOrTrainModel();
        Instances template = loadTemplate(TRAIN_FILES);
        PredictService service = new PredictService(model, template);
        service.startServer();
    }

    private static Classifier loadOrTrainModel() throws Exception {
        File modelFile = new File(MODEL_FILE);
        if (!modelFile.exists()) {
            System.out.println("No model found; training new model...");
            com.ruralhealth.TrainModel.main(new String[]{});
        }
        return (Classifier) SerializationHelper.read(MODEL_FILE);
    }

    private static Instances loadTemplate(String[] paths) throws IOException {
        Path resolved = CsvUtils.resolveDataPath(paths);
        System.out.println("Using dataset template from " + resolved);
        CSVLoader loader = new CSVLoader();
        File normalized = CsvUtils.normalizeHeader(resolved);
        loader.setSource(normalized);
        Instances data = loader.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);
        return data;
    }

    private void startServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/predict", new PredictHandler());
        server.setExecutor(null);
        System.out.println("Java AI service listening on http://localhost:" + PORT);
        server.start();
    }

    private class PredictHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, Map.of("message", "Method not allowed"));
                return;
            }

            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();
            JsonObject symptomObj = json.getAsJsonObject("symptoms");
            if (symptomObj == null) {
                sendResponse(exchange, 400, Map.of("message", "Missing symptoms payload"));
                return;
            }

            try {
                Map<String, Object> response = classify(symptomObj);
                sendResponse(exchange, 200, response);
            } catch (Exception ex) {
                sendResponse(exchange, 500, Map.of("message", "Prediction failed", "error", ex.getMessage()));
            }
        }
    }

    private Map<String, Object> classify(JsonObject symptomObj) throws Exception {
        double[] values = new double[template.numAttributes()];
        for (int i = 0; i < template.numAttributes(); i++) {
            Attribute attr = template.attribute(i);
            if (attr == null) {
                continue;
            }
            if (attr.isNominal() && attr.name().equals("disease")) {
                values[i] = Double.NaN;
                continue;
            }
            values[i] = 0.0;
        }

        for (String symptomKey : symptomObj.keySet()) {
            if (symptomObj.get(symptomKey).getAsInt() != 1) {
                continue;
            }
            for (String col : SymptomMapping.getDatasetAttributes(symptomKey)) {
                Attribute attr = template.attribute(col);
                if (attr != null) {
                    values[attr.index()] = 1.0;
                }
            }
        }

        DenseInstance instance = new DenseInstance(1.0, values);
        instance.setDataset(template);
        double[] distribution = model.distributionForInstance(instance);
        int bestIndex = maxIndex(distribution);
        String disease = template.classAttribute().value(bestIndex);
        int confidence = (int) Math.round(distribution[bestIndex] * 100);
        String risk = calculateRisk(confidence, symptomObj);
        String advice = generateAdvice(disease, risk);

        List<Map<String, Object>> topPredictions = topKPredictions(distribution, 3);
        String explanation = buildExplanation(symptomObj, disease, confidence, risk);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("disease", disease);
        response.put("confidence", confidence);
        response.put("risk", risk);
        response.put("advice", advice);
        response.put("topPredictions", topPredictions);
        response.put("explanation", explanation);
        return response;
    }

    private static int maxIndex(double[] distribution) {
        int index = 0;
        for (int i = 1; i < distribution.length; i++) {
            if (distribution[i] > distribution[index]) {
                index = i;
            }
        }
        return index;
    }

    private List<Map<String, Object>> topKPredictions(double[] distribution, int k) {
        List<Map<String, Object>> output = new ArrayList<>();
        List<Integer> indexes = new ArrayList<>();
        for (int i = 0; i < distribution.length; i++) indexes.add(i);
        indexes.sort((a, b) -> Double.compare(distribution[b], distribution[a]));
        for (int i = 0; i < Math.min(k, indexes.size()); i++) {
            int idx = indexes.get(i);
            output.add(Map.of(
                    "disease", template.classAttribute().value(idx),
                    "confidence", (int) Math.round(distribution[idx] * 100)
            ));
        }
        return output;
    }

    private String calculateRisk(int confidence, JsonObject symptomObj) {
        boolean serious = symptomObj.has("difficulty_breathing") && symptomObj.get("difficulty_breathing").getAsInt() == 1;
        if (confidence >= 85 || serious) {
            return "High";
        }
        if (confidence >= 60) {
            return "Medium";
        }
        return "Low";
    }

    private String generateAdvice(String disease, String risk) {
        return switch (disease) {
            case "Malaria" -> risk.equals("High") ? "Seek treatment immediately and visit a clinic." : "Hydrate, monitor fever, and see a health worker within 24 hours.";
            case "Typhoid" -> "Drink clean water, rest, and consult a clinician for stool testing and antibiotics.";
            case "Pneumonia" -> "Urgent medical review is advised, especially if breathing is difficult.";
            case "Gastroenteritis" -> "Keep hydrated, avoid contaminated food, and follow up with a health worker if symptoms worsen.";
            case "Allergy" -> "Avoid triggers, use a cool compress, and visit a local clinic if breathing worsens.";
            case "Bronchitis" -> "Rest, drink warm fluids, and see a provider if cough persists more than 48 hours.";
            case "Dengue" -> "Visit a clinic quickly for blood tests and keep hydrated.";
            case "Asthma" -> "Use inhalers if available and seek urgent assessment for breathing difficulty.";
            default -> "Monitor symptoms, stay hydrated, and consult a rural health provider if you do not improve.";
        };
    }

    private String buildExplanation(JsonObject symptomObj, String disease, int confidence, String risk) {
        List<String> present = new ArrayList<>();
        symptomObj.entrySet().forEach(entry -> {
            if (entry.getValue().getAsInt() == 1) {
                present.add(entry.getKey().replace('_', ' '));
            }
        });
        return String.format("Based on symptoms [%s], the model predicts %s with %d%% confidence and %s risk.",
                String.join(", ", present), disease, confidence, risk);
    }

    private void sendResponse(HttpExchange exchange, int code, Object payload) throws IOException {
        String response = gson.toJson(payload);
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
