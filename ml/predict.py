import sys
import json
import joblib
import pandas as pd
import numpy as np
import os
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

def load_artifacts():
    """Load model and scaler from the same directory as this script"""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'outbreak_model.pkl')
        scaler_path = os.path.join(current_dir, 'scaler.pkl')
        
        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Model artifacts not found in {current_dir}")
            
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        return model, scaler
    except Exception as e:
        print(json.dumps({"error": f"Failed to load artifacts: {str(e)}"}))
        sys.exit(1)

def predict(features):
    """
    Make a prediction based on input features
    Features should be a dictionary matching the schema
    """
    try:
        model, scaler = load_artifacts()
        
        # Expected feature order
        feature_cols = [
            'health_incidents_last_7d', 
            'health_incidents_last_14d',
            'dengue_incidents_last_7d', 
            'malaria_incidents_last_7d',
            'open_sanitation_complaints', 
            'total_sanitation_complaints_last_7d',
            'avg_pm25_last_7d', 
            'avg_pm10_last_7d', 
            'max_pm25_last_7d'
        ]
        
        # Create DataFrame
        df = pd.DataFrame([features])
        
        # Ensure correct column order
        df = df[feature_cols]
        
        # Scale features
        df_scaled = scaler.transform(df)
        
        # Predict probability
        # Note: Some models (like VotingClassifier) might have predict_proba
        try:
            probability = model.predict_proba(df_scaled)[0][1]
        except:
            # Fallback if model doesn't support probability
            prediction = model.predict(df_scaled)[0]
            probability = float(prediction)
            
        return probability
        
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_str = sys.stdin.read()
        if not input_str:
            raise ValueError("No input data received")
            
        features = json.loads(input_str)
        
        # Run prediction
        prob = predict(features)
        
        # identifying input top drivers (simple heuristic based on weights/values)
        # This is a simplification for the API response. Real interpretability would require SHAP.
        drivers = []
        if features.get('open_sanitation_complaints', 0) > 5:
            drivers.append("High Sanitation Complaints")
        if features.get('max_pm25_last_7d', 0) > 150:
            drivers.append("PM2.5 Spike")
        if features.get('health_incidents_last_7d', 0) > 3:
            drivers.append("Rising Health Incidents")
        if features.get('dengue_incidents_last_7d', 0) > 0:
            drivers.append("Dengue Detected")
            
        result = {
            "probability": prob,
            "risk_level": "HIGH" if prob >= 0.7 else "MEDIUM" if prob >= 0.4 else "LOW",
            "top_drivers": drivers if drivers else ["Normal Activity"]
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
