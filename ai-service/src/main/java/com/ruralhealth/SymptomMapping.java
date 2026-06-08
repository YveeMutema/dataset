package com.ruralhealth;

import java.util.HashMap;
import java.util.Map;

public class SymptomMapping {
    private static final Map<String, String[]> mapping = new HashMap<>();

    static {
        mapping.put("fever", new String[]{"high_fever", "mild_fever"});
        mapping.put("headache", new String[]{"headache"});
        mapping.put("cough", new String[]{"cough"});
        mapping.put("vomiting", new String[]{"vomiting"});
        mapping.put("diarrhoea", new String[]{"diarrhoea"});
        mapping.put("chest_pain", new String[]{"chest_pain"});
        mapping.put("chills", new String[]{"chills"});
        mapping.put("weakness", new String[]{"weakness_in_limbs", "weakness_of_one_body_side", "muscle_weakness"});
        mapping.put("skin_rash", new String[]{"skin_rash", "red_spots_over_body"});
        mapping.put("difficulty_breathing", new String[]{"breathlessness", "difficulty_breathing"});
    }

    public static String[] getDatasetAttributes(String symptom) {
        return mapping.getOrDefault(symptom, new String[0]);
    }
}
