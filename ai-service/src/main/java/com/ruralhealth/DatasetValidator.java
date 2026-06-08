package com.ruralhealth;

import weka.core.Instances;
import weka.core.Instance;

import java.util.ArrayList;
import java.util.List;

public class DatasetValidator {

    public List<String> validate(Instances data) {
        List<String> warnings = new ArrayList<>();
        for (int i = 0; i < data.numInstances(); i++) {
            Instance instance = data.instance(i);
            String disease = instance.stringValue(instance.numAttributes() - 1);
            boolean fever = getFieldValue(instance, data, "high_fever") || getFieldValue(instance, data, "mild_fever");
            boolean headache = getFieldValue(instance, data, "headache");
            boolean cough = getFieldValue(instance, data, "cough");
            boolean vomiting = getFieldValue(instance, data, "vomiting");
            boolean diarrhoea = getFieldValue(instance, data, "diarrhoea");
            boolean chestPain = getFieldValue(instance, data, "chest_pain");
            boolean chills = getFieldValue(instance, data, "chills");
            boolean weakness = getFieldValue(instance, data, "weakness_in_limbs") || getFieldValue(instance, data, "weakness_of_one_body_side") || getFieldValue(instance, data, "muscle_weakness");
            boolean skinRash = getFieldValue(instance, data, "skin_rash") || getFieldValue(instance, data, "red_spots_over_body");
            boolean difficultyBreathing = getFieldValue(instance, data, "breathlessness") || getFieldValue(instance, data, "difficulty_breathing");

            warnings.addAll(MedicalRules.validate(disease, fever, headache, cough, vomiting, diarrhoea,
                    chestPain, chills, weakness, skinRash, difficultyBreathing));
        }
        return warnings;
    }

    private boolean getFieldValue(Instance instance, Instances data, String attributeName) {
        if (data.attribute(attributeName) == null) {
            return false;
        }
        return instance.value(data.attribute(attributeName)) == 1.0;
    }
}
