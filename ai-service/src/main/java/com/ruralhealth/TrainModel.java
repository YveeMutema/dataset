package com.ruralhealth;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;
import weka.classifiers.trees.RandomForest;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.CSVLoader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class TrainModel {
    private static final String[] TRAIN_FILES = {
            "data/train.csv",
            "data/Training.csv",
            "Training.csv",
            "../Training.csv"
    };
    private static final String[] TEST_FILES = {
            "data/test.csv",
            "data/Testing.csv",
            "Testing.csv",
            "../Testing.csv"
    };
    private static final String MODEL_FILE = "data/model.bin";

    public static void main(String[] args) throws Exception {
        Instances train = loadCsv(TRAIN_FILES);
        Instances test = loadCsv(TEST_FILES);

        DatasetValidator validator = new DatasetValidator();
        List<String> trainWarnings = validator.validate(train);
        List<String> testWarnings = validator.validate(test);
        logWarnings(trainWarnings, "train");
        logWarnings(testWarnings, "test");

        train.setClassIndex(train.numAttributes() - 1);
        test.setClassIndex(test.numAttributes() - 1);

        J48 j48 = buildJ48();
        RandomForest rf = buildRandomForest();

        System.out.println("Training J48 decision tree...");
        j48.buildClassifier(train);
        System.out.println(evaluateModel(j48, train, test, "J48"));

        System.out.println("Training Random Forest ensemble...");
        rf.buildClassifier(train);
        System.out.println(evaluateModel(rf, train, test, "RandomForest"));

        Evaluation cvEval = new Evaluation(train);
        cvEval.crossValidateModel(rf, train, 10, new Random(42));
        System.out.println(String.format("RandomForest 10-fold CV accuracy: %.2f%%", cvEval.pctCorrect()));

        Classifier finalModel = rf;
        SerializationHelper.write(MODEL_FILE, finalModel);
        System.out.println("Saved trained model to " + MODEL_FILE);
    }

    private static Instances loadCsv(String[] paths) throws IOException {
        Path resolved = CsvUtils.resolveDataPath(paths);
        System.out.println("Loading dataset from " + resolved);
        CSVLoader loader = new CSVLoader();
        File normalized = CsvUtils.normalizeHeader(resolved);
        loader.setSource(normalized);
        Instances data = loader.getDataSet();
        return data;
    }

    private static J48 buildJ48() {
        J48 j48 = new J48();
        j48.setUnpruned(false);
        j48.setConfidenceFactor(0.15f);
        j48.setMinNumObj(5);
        j48.setReducedErrorPruning(false);
        j48.setSubtreeRaising(true);
        j48.setBinarySplits(false);
        return j48;
    }

    private static RandomForest buildRandomForest() {
        RandomForest rf = new RandomForest();
        rf.setNumIterations(120);
        rf.setMaxDepth(10);
        rf.setNumExecutionSlots(4);
        rf.setSeed(42);
        return rf;
    }

    private static String evaluateModel(Classifier model, Instances train, Instances test, String name) throws Exception {
        Evaluation evalTrain = new Evaluation(train);
        evalTrain.evaluateModel(model, train);

        Evaluation evalTest = new Evaluation(train);
        evalTest.evaluateModel(model, test);

        return String.format("%s accuracy: train=%.2f%% test=%.2f%%\n", name,
                evalTrain.pctCorrect(), evalTest.pctCorrect());
    }

    private static void logWarnings(List<String> warnings, String setName) {
        if (!warnings.isEmpty()) {
            System.out.println("Validation warnings for " + setName + " dataset:");
            warnings.stream().distinct().forEach(System.out::println);
        }
    }
}
