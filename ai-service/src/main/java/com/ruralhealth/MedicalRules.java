package com.ruralhealth;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class MedicalRules {
    private static final Map<String, String[]> diseaseSymptomMap = new LinkedHashMap<>();

    static {
        diseaseSymptomMap.put("Malaria", new String[]{"high_fever", "chills", "headache"});
        diseaseSymptomMap.put("Typhoid", new String[]{"high_fever", "vomiting", "weakness_in_limbs"});
        diseaseSymptomMap.put("Pneumonia", new String[]{"cough", "chest_pain", "breathlessness"});
        diseaseSymptomMap.put("Gastroenteritis", new String[]{"vomiting", "diarrhoea", "weakness_in_limbs"});
        diseaseSymptomMap.put("Allergy", new String[]{"cough", "skin_rash", "headache"});
        diseaseSymptomMap.put("Bronchitis", new String[]{"cough", "chest_pain", "breathlessness"});
        diseaseSymptomMap.put("Dengue", new String[]{"high_fever", "headache", "weakness_in_limbs"});
        diseaseSymptomMap.put("Asthma", new String[]{"cough", "breathlessness", "chest_pain"});
    }

    public static List<String> validate(String disease, boolean fever, boolean headache, boolean cough, boolean vomiting,
                                        boolean diarrhoea, boolean chestPain, boolean chills, boolean weakness,
                                        boolean skinRash, boolean difficultyBreathing) {
        List<String> warnings = new ArrayList<>();
        String[] required = diseaseSymptomMap.get(disease);
        if (required != null) {
            for (String symptom : required) {
                boolean present;
                switch (symptom) {
                    case "high_fever", "mild_fever" -> present = fever;
                    case "headache" -> present = headache;
                    case "cough" -> present = cough;
                    case "vomiting" -> present = vomiting;
                    case "diarrhoea" -> present = diarrhoea;
                    case "chest_pain" -> present = chestPain;
                    case "chills" -> present = chills;
                    case "weakness_in_limbs", "weakness_of_one_body_side", "muscle_weakness" -> present = weakness;
                    case "skin_rash", "red_spots_over_body" -> present = skinRash;
                    case "breathlessness", "difficulty_breathing" -> present = difficultyBreathing;
                    default -> present = false;
                }
                if (!present) {
                    warnings.add(String.format("Dataset entry for %s should include %s.", disease, symptom));
                }
            }
        }
        return warnings;
    }
}
