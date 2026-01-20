# Windows Installation Guide

## Recommended: Use Anaconda

### Step 1: Install Anaconda
1. Download from: https://www.anaconda.com/download
2. Run installer, accept defaults
3. Open "Anaconda Prompt" from Start Menu

### Step 2: Create Environment
```bash
cd C:\Users\ashis\OneDrive\Desktop\Projects\HackX\ml
conda create -n outbreak-ml python=3.11 -y
conda activate outbreak-ml
```

### Step 3: Install Packages
```bash
conda install pandas=2.0.3 numpy=1.24.3 scikit-learn=1.3.2 joblib=1.3.2 -y
```

### Step 4: Run Training
```bash
python train_model.py
```

## Alternative: Windows PowerShell (No Git Bash)

### Step 1: Open PowerShell
Press `Win + X`, select "Windows PowerShell"

### Step 2: Navigate and Create venv
```powershell
cd C:\Users\ashis\OneDrive\Desktop\Projects\HackX\ml
python -m venv env_win
.\env_win\Scripts\Activate.ps1
```

### Step 3: Install (PowerShell doesn't have SSL issues)
```powershell
python -m pip install --upgrade pip
pip install pandas==2.0.3 numpy==1.24.3 scikit-learn==1.3.2 joblib==1.3.2
```

### Step 4: Run
```powershell
python train_model.py
```

## Why Git Bash Fails

Git Bash (MINGW64) uses its own SSL certificates which are outdated or misconfigured. Use native Windows tools instead.

## Quick Test

After installation, test with:
```python
python -c "import pandas, numpy, sklearn; print('✓ All packages installed')"
```
