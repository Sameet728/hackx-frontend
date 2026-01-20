# HealthPulse: AI-Driven Public Health & Urban Risk Dashboard 

##  The Problem
Rapid urbanization has led to disconnected systems for monitoring public health and city sanitation. 
- **Reactive, not Proactive:** Authorities often respond to disease outbreaks (like Dengue or Malaria) *after* they have already spread.
- **Data Silos:** Sanitation data (garbage dumps, overflowing drains) and environmental data (air quality) are rarely correlated with health incident reports.
- **Lack of Predictive Power:** There is no early warning system to predict where the next outbreak might occur based on leading indicators.

##  Our Solution
**HealthPulse** is an integrated command center that combines real-time data aggregation with Machine Learning to predict and prevent disease outbreaks.

We bridge the gap between **Sanitation**, **Environment**, and **Public Health**.

### Key Features
1.  **Unified Data Dashboard:**
    *   Visualizes real-time **Sanitation Complaints** (garbage, drainage issues).
    *   Tracks **Health Incidents** (Dengue, Malaria cases) by area.
    *   Monitors **Environmental Quality** (PM2.5, PM10, Water Quality).

2.  ** AI Outbreak Prediction Engine:**
    *   Uses an **Ensemble Machine Learning Model** (XGBoost, LightGBM, CatBoost) to analyze correlations.
    *   **Predicts the probability** of a disease outbreak 7-14 days in advance.
    *   Identifies **Risk Drivers** (e.g., "Rising sanitation complaints in Dadar are 80% likely to lead to a Dengue spike").

3.  **Smart Area Profiling:**
    *   Drill-down views for specific localities (e.g., Dadar, Andheri).
    *   Automatic "High Risk" flagging for areas requiring immediate intervention.

---

##  Technology Stack

### **Machine Learning (The Brain)** 
- **Core:** Python 3.13
- **Libraries:** Scikit-learn, XGBoost, LightGBM, CatBoost
- **Model:** Soft Voting Classifier (Ensemble)
- **Accuracy:** ~97% (ROC-AUC 0.89)
- **Inputs:** 9 features including 7/14-day aggregated health incidents, open sanitation complaints, and air quality trends.

### **Backend (The Nervous System)** 
- **Runtime:** Node.js & Express
- **Database:** MongoDB Atlas (Cloud)
- **Integration:** Spawns Python processes for real-time inference.
- **API:** RESTful endpoints for Health, Sanitation, Environment, and Predictions.

### **Frontend (The Face)** 
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Visualization:** Recharts (Interactive Bar/Line charts).
- **Features:** Dynamic Insights Panel, Area Filtering, Real-time KPI cards.

---

##  How It Works

1.  **Data Ingestion:** The system continuously collects data on health cases reported by hospitals and sanitation complaints filed by citizens.
2.  **Feature Engineering:** The backend aggregates this raw data into sliding windows (last 7 days, last 14 days).
3.  **Prediction:** When a user views an area, the Node.js backend feeds these features into the pre-trained Python ML model.
4.  **Actionable Insight:** The dashboard displays a **Risk Probability** (e.g., "78% Risk") and suggests specific actions (e.g., "Deploy Vector Control").

##  Future Roadmap
- **GIS Mapping:** Visual heatmaps required for spatial analysis.
- **SMS Alerts:** Automated notifications to municipal ward officers.
- **Citizen App:** Mobile app for citizens to report issues directly.
