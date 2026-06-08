# Rural Health AI – Smart Disease Prediction Mobile Application

This workspace contains a full-stack prototype for a rural health disease prediction system with:

- `backend/` — Node.js Express API with JWT auth, MongoDB storage, prediction routing, history, and stats.
- `mobile/` — React Native Expo app for symptom input, prediction display, health advice, history, and clinic locator.
- `ai-service/` — Java Weka service, dataset validation, J48 and Random Forest training, and REST prediction endpoint.

## Run the Java AI service

1. Open a terminal in `ai-service/`.
2. Run `mvn clean package`.
3. Run `java -jar target/rural-health-ai-service-1.0.0-jar-with-dependencies.jar`.

The service listens on `http://localhost:9000/predict` and trains the model from `data/train.csv` and `data/test.csv` if needed.

## Run the backend API

1. Open a terminal in `backend/`.
2. Copy `.env.example` to `.env` and update values.
3. Run `npm install`.
4. Run `npm run dev`.

The backend listens on `http://localhost:5000` and forwards symptom data to the Java AI service.

## Run the mobile app

1. Open a terminal in `mobile/`.
2. Run `npm install`.
3. Run `npm start`.
4. Launch on an Android emulator, iOS simulator, or physical device.

> If using Android emulator, the mobile API base URL is configured to `http://10.0.2.2:5000` in `mobile/services/api.js`.

## Notes

- The Java service includes a medical validation module to flag inconsistent symptom/disease combinations.
- The Random Forest model is trained with pruning and constrained depth to reduce overfitting.
- The backend stores user predictions and exposes history and stats.
- The mobile app provides a user-friendly rural health workflow.
