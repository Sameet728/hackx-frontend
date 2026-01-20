# Outbreak Prediction ML System

## Overview
Lightweight ML system for predicting disease outbreak probability in the next 7 days.

## Quick Setup Options

### Option 1: Using Anaconda/Miniconda (RECOMMENDED for Windows)
```bash
# Download and install Miniconda from https://docs.conda.io/en/latest/miniconda.html
# Then run:
conda create -n outbreak-ml python=3.11 -y
conda activate outbreak-ml
conda install pandas numpy scikit-learn joblib -y
```

### Option 2: Using pip with pre-built wheels
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install with binary-only flag
pip install --only-binary :all: pandas numpy scikit-learn joblib
```

### Option 3: Fix SSL Certificate Issues (Git Bash/MINGW64)
```bash
# Temporary SSL bypass (for development only)
pip install --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org --only-binary :all: pandas numpy scikit-learn joblib
```

### Option 4: Manual wheel download
1. Go to https://www.lfd.uci.edu/~gohlke/pythonlibs/ (unofficial Windows binaries)
2. Download `.whl` files for: numpy, pandas, scikit-learn, joblib
3. Install: `pip install numpy-*.whl pandas-*.whl scikit-learn-*.whl joblib-*.whl`

## Usage

### 1. Train the Model
```bash
cd ml
python train_model.py
```

This will:
- Load 900 CSV records (300 each from health, sanitation, environmental data)
- Engineer 9 features per area per day
- Train Logistic Regression classifier
- Save `outbreak_model.pkl`, `scaler.pkl`, and `model_metadata.json`

### 2. Features Engineered

| Feature | Description | Importance |
|---------|-------------|------------|
| health_incidents_last_7d | Health incidents in last 7 days | High |
| health_incidents_last_14d | Health incidents in last 14 days | High |
| dengue_incidents_last_7d | Dengue-specific count | Medium |
| malaria_incidents_last_7d | Malaria-specific count | Medium |
| open_sanitation_complaints | Currently unresolved complaints | High |
| total_sanitation_complaints_last_7d | All complaints in last 7 days | Medium |
| avg_pm25_last_7d | Average PM2.5 air quality | Medium |
| avg_pm10_last_7d | Average PM10 air quality | Low |
| max_pm25_last_7d | Maximum PM2.5 spike | Medium |

### 3. Target Variable
**Outbreak = 1** if health incidents in next 7 days > 5, else **0**

### 4. Model Output
Probability score [0.0 - 1.0]:
- **0.0-0.3**: Low Risk (routine surveillance)
- **0.3-0.7**: Medium Risk (enhanced monitoring)
- **0.7-1.0**: High Risk (immediate intervention)

## Files

- `data_preprocessing.py` - Feature engineering pipeline
- `train_model.py` - Model training and evaluation
- `feature_schema.json` - Feature documentation for API integration
- `outbreak_model.pkl` - Trained Logistic Regression model
- `scaler.pkl` - StandardScaler for feature normalization
- `model_metadata.json` - Model metrics and metadata

## Architecture

```
CSV Data (300 rows each)
    ↓
Feature Engineering
    ↓
9 Features per area per day
    ↓
Logistic Regression
    ↓
Outbreak Probability [0-1]
```

## Expected Performance
- **Accuracy**: ~75-85%
- **ROC-AUC**: ~0.70-0.85
- **Model Type**: Logistic Regression (explainable)

## Troubleshooting

### SSL Certificate Error
Your Git Bash environment has SSL issues. Solutions:
1. Use Anaconda (easiest)
2. Install packages on Windows CMD instead of Git Bash
3. Use `--trusted-host` flags with pip

### Import Errors
Make sure you activated the virtual environment:
```bash
source env/bin/activate  # Git Bash
# or
.\env\Scripts\activate  # Windows CMD
```

## Integration with Backend

See `feature_schema.json` for API payload structure. The model expects:
```python
features = {
    'health_incidents_last_7d': 3,
    'health_incidents_last_14d': 8,
    # ... 7 more features
}
```

Returns:
```python
{
    'outbreak_probability': 0.68,
    'risk_level': 'Medium Risk'
}
```
