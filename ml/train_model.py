"""
Outbreak Prediction Model Training (Advanced Ensemble)
======================================================
This module trains an advanced Ensemble model to predict 
disease outbreak probability in the next 7 days.

Models used in Ensemble:
- XGBoost
- LightGBM
- CatBoost
- Random Forest
- Logistic Regression (for baseline Probability)

Method: Voting Classifier (Soft Voting)
Output: Probability score [0, 1]

Author: HackX ML Team
Date: January 2026
"""

import pandas as pd
import numpy as np
import joblib
import json
import warnings

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report, confusion_matrix

# Advanced Boosting Libraries
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

# Local Import
try:
    from data_preprocessing import preprocess_data
except ImportError:
    # Fallback if running from root
    import sys
    sys.path.append('ml')
    from data_preprocessing import preprocess_data

# Suppress minor warnings for cleaner output
warnings.filterwarnings('ignore')

# Configuration
MODEL_TYPE = 'ensemble_voting_gbm'
RANDOM_STATE = 42
TEST_SIZE = 0.2


def prepare_features_and_target(dataset):
    print("🔧 Preparing features and target...")
    feature_cols = [
        'health_incidents_last_7d', 'health_incidents_last_14d',
        'dengue_incidents_last_7d', 'malaria_incidents_last_7d',
        'open_sanitation_complaints', 'total_sanitation_complaints_last_7d',
        'avg_pm25_last_7d', 'avg_pm10_last_7d', 'max_pm25_last_7d'
    ]
    X = dataset[feature_cols].copy()
    y = dataset['outbreak'].copy()
    print(f"✓ Features: {X.shape}, Target: {y.shape}")
    return X, y, feature_cols


def split_data(X, y):
    print(f"\n📊 Splitting data (test_size={TEST_SIZE})...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"✓ Train: {len(X_train)}, Test: {len(X_test)}")
    return X_train, X_test, y_train, y_test


def scale_features(X_train, X_test):
    print("\n⚖️  Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("✓ Features standardized")
    return X_train_scaled, X_test_scaled, scaler


def train_ensemble_model(X_train, y_train):
    print(f"\n🤖 Initializing Ensemble Models (XGBoost + LightGBM + CatBoost + RF)...")

    # 1. Logistic Regression (Baseline)
    log_reg = LogisticRegression(random_state=RANDOM_STATE, class_weight='balanced')
    
    # 2. Random Forest
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=RANDOM_STATE, class_weight='balanced')
    
    # 3. XGBoost
    xgb = XGBClassifier(
        n_estimators=100, learning_rate=0.05, max_depth=6, 
        eval_metric='logloss', random_state=RANDOM_STATE, use_label_encoder=False
    )

    # 4. LightGBM
    lgbm = LGBMClassifier(
        n_estimators=100, learning_rate=0.05, max_depth=6, 
        random_state=RANDOM_STATE, verbose=-1, class_weight='balanced'
    )

    # 5. CatBoost
    cat = CatBoostClassifier(
        iterations=100, learning_rate=0.05, depth=6, 
        random_seed=RANDOM_STATE, verbose=0, auto_class_weights='Balanced'
    )

    # Create Ensemble (Voting Classifier)
    print("🤝 Creating Voting Classifier (Soft Voting)...")
    ensemble = VotingClassifier(
        estimators=[
            ('lr', log_reg),
            ('rf', rf),
            ('xgb', xgb),
            ('lgbm', lgbm),
            ('cat', cat)
        ],
        voting='soft'  # Average probabilities
    )

    print("🚀 Training Ensemble Model...")
    ensemble.fit(X_train, y_train)
    print("✓ Training completed")
    
    return ensemble


def evaluate_model(model, X_train, X_test, y_train, y_test, feature_names):
    print("\n📈 EVALUATING ENSEMBLE PERFORMANCE")
    print("="*60)
    
    y_test_pred = model.predict(X_test)
    y_test_proba = model.predict_proba(X_test)[:, 1]
    y_train_proba = model.predict_proba(X_train)[:, 1]
    
    metrics = {
        'train_roc_auc': roc_auc_score(y_train, y_train_proba),
        'test_roc_auc': roc_auc_score(y_test, y_test_proba),
        'test_accuracy': accuracy_score(y_test, y_test_pred)
    }

    print(f"\n🎯 FINAL METRICS:")
    print(f"  Test Accuracy:       {metrics['test_accuracy']:.4f}")
    print(f"  Test ROC-AUC:        {metrics['test_roc_auc']:.4f}")
    print(f"  Train ROC-AUC:       {metrics['train_roc_auc']:.4f}")

    print("\n📋 CLASSIFICATION REPORT:")
    print(classification_report(y_test, y_test_pred, target_names=['No Outbreak', 'Outbreak']))
    
    print("\n🔢 CONFUSION MATRIX:")
    print(confusion_matrix(y_test, y_test_pred))

    # Feature Importance (Proxy using Random Forest from ensemble if possible)
    try:
        print("\n💡 FEATURE IMPORTANCE (Proxy from Random Forest component):")
        rf_model = model.named_estimators_['rf']
        importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': rf_model.feature_importances_
        }).sort_values('Importance', ascending=False)
        
        for _, row in importance_df.head(10).iterrows():
            print(f"  📊 {row['Feature']:40s}: {row['Importance']:.4f}")
    except:
        print("  (Feature importance extraction skipped for voting ensemble)")
        
    print("\n" + "="*60)
    return metrics


def save_model(model, scaler, feature_names, metrics):
    print("\n💾 Saving model and artifacts...")
    joblib.dump(model, 'outbreak_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    metadata = {
        'model_type': MODEL_TYPE,
        'feature_names': feature_names,
        'metrics': metrics,
        'timestamp': pd.Timestamp.now().isoformat()
    }
    with open('model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✓ Saved: outbreak_model.pkl, scaler.pkl, model_metadata.json")


def main():
    print("\n" + "="*60)
    print("🚀 ADVANCED OUTBREAK PREDICTION: ENSEMBLE TRAINING")
    print("="*60 + "\n")

    dataset = preprocess_data()
    X, y, feature_names = prepare_features_and_target(dataset)
    X_train, X_test, y_train, y_test = split_data(X, y)
    X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
    
    model = train_ensemble_model(X_train_scaled, y_train)
    metrics = evaluate_model(model, X_train_scaled, X_test_scaled, y_train, y_test, feature_names)
    save_model(model, scaler, feature_names, metrics)

    # Example Prediction
    print("\n🧪 EXAMPLE PREDICTION (Ensemble):")
    # Using the same example feature vector as before for comparison
    example_features = np.array([[3, 8, 2, 1, 12, 5, 165.0, 220.0, 180.0]])
    example_scaled = scaler.transform(example_features)
    prob = model.predict_proba(example_scaled)[0][1]
    
    print(f"🎯 Probability: {prob:.2%}")
    if prob > 0.7: print("⚠️  HIGH RISK")
    elif prob > 0.3: print("⚡ MEDIUM RISK")
    else: print("✅ LOW RISK")
    
    print("\n" + "="*60)
    print("✅ ENSEMBLE TRAINING COMPLETED SUCCESSFULLY")
    print("="*60)

if __name__ == "__main__":
    main()
