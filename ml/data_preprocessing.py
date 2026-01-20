"""
Data Preprocessing Pipeline for Outbreak Prediction
=====================================================
This module loads health, sanitation, and environmental data,
then engineers features for outbreak prediction.

Author: HackX ML Team
Date: January 2026
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Configuration
DATA_DIR = '../backend/data'
OUTBREAK_THRESHOLD = 5  # Cases in next 7 days to classify as outbreak

def load_datasets():
    """
    Load all three CSV datasets
    
    Returns:
        tuple: (health_df, sanitation_df, environmental_df)
    """
    print("📊 Loading datasets...")
    
    health_path = os.path.join(DATA_DIR, 'health_incidents_pune_300_rows.csv')
    sanitation_path = os.path.join(DATA_DIR, 'sanitation_complaints_pune_300_rows.csv')
    environmental_path = os.path.join(DATA_DIR, 'environmental_data_pune_300_rows.csv')
    
    # Load CSVs
    health_df = pd.read_csv(health_path, parse_dates=['reportedDate'])
    sanitation_df = pd.read_csv(sanitation_path, parse_dates=['reportedDate'])
    environmental_df = pd.read_csv(environmental_path, parse_dates=['recordedDate'])
    
    print(f"✓ Loaded {len(health_df)} health incidents")
    print(f"✓ Loaded {len(sanitation_df)} sanitation complaints")
    print(f"✓ Loaded {len(environmental_df)} environmental records")
    
    return health_df, sanitation_df, environmental_df


def create_area_date_grid(health_df, sanitation_df, environmental_df):
    """
    Create a complete grid of all area-date combinations
    This ensures we have records for every area on every date
    
    Returns:
        pd.DataFrame: Grid with columns [area, date]
    """
    # Get all unique areas
    areas = set()
    areas.update(health_df['area'].unique())
    areas.update(sanitation_df['area'].unique())
    areas.update(environmental_df['area'].unique())
    
    # Get date range
    all_dates = pd.concat([
        health_df['reportedDate'],
        sanitation_df['reportedDate'],
        environmental_df['recordedDate']
    ])
    
    min_date = all_dates.min()
    max_date = all_dates.max()
    
    # Create date range
    date_range = pd.date_range(start=min_date, end=max_date, freq='D')
    
    # Create grid
    grid = pd.MultiIndex.from_product([areas, date_range], names=['area', 'date']).to_frame(index=False)
    
    print(f"✓ Created grid: {len(areas)} areas × {len(date_range)} days = {len(grid)} records")
    
    return grid


def engineer_health_features(health_df, grid):
    """
    Engineer health-related features
    
    Features:
    - health_incidents_last_7d: Count of incidents in last 7 days
    - health_incidents_last_14d: Count of incidents in last 14 days
    - dengue_incidents_last_7d: Dengue-specific count
    - malaria_incidents_last_7d: Malaria-specific count
    
    Returns:
        pd.DataFrame: Grid with health features
    """
    print("🧬 Engineering health features...")
    
    # Prepare health data
    health_df = health_df.copy()
    health_df['date'] = health_df['reportedDate'].dt.date
    
    features = grid.copy()
    features['date_obj'] = features['date'].dt.date
    
    # Initialize feature columns
    features['health_incidents_last_7d'] = 0
    features['health_incidents_last_14d'] = 0
    features['dengue_incidents_last_7d'] = 0
    features['malaria_incidents_last_7d'] = 0
    
    # Group health data by area and date
    for area in features['area'].unique():
        area_health = health_df[health_df['area'] == area].copy()
        
        for idx, row in features[features['area'] == area].iterrows():
            current_date = row['date_obj']
            
            # Last 7 days window
            start_7d = current_date - timedelta(days=7)
            incidents_7d = area_health[
                (area_health['date'] > start_7d) & 
                (area_health['date'] <= current_date)
            ]
            
            # Last 14 days window
            start_14d = current_date - timedelta(days=14)
            incidents_14d = area_health[
                (area_health['date'] > start_14d) & 
                (area_health['date'] <= current_date)
            ]
            
            # Update features
            features.loc[idx, 'health_incidents_last_7d'] = len(incidents_7d)
            features.loc[idx, 'health_incidents_last_14d'] = len(incidents_14d)
            features.loc[idx, 'dengue_incidents_last_7d'] = len(incidents_7d[incidents_7d['diseaseType'] == 'Dengue'])
            features.loc[idx, 'malaria_incidents_last_7d'] = len(incidents_7d[incidents_7d['diseaseType'] == 'Malaria'])
    
    features = features.drop('date_obj', axis=1)
    
    print(f"✓ Engineered 4 health features")
    
    return features


def engineer_sanitation_features(sanitation_df, grid):
    """
    Engineer sanitation-related features
    
    Features:
    - open_sanitation_complaints: Count of open complaints
    - total_sanitation_complaints_last_7d: All complaints in last 7 days
    
    Returns:
        pd.DataFrame: Sanitation features
    """
    print("🚮 Engineering sanitation features...")
    
    sanitation_df = sanitation_df.copy()
    sanitation_df['date'] = sanitation_df['reportedDate'].dt.date
    
    features = []
    
    for _, row in grid.iterrows():
        area = row['area']
        current_date = row['date'].date()
        
        area_complaints = sanitation_df[sanitation_df['area'] == area]
        
        # Open complaints (as of current date)
        open_complaints = area_complaints[
            (area_complaints['date'] <= current_date) & 
            (area_complaints['status'] == 'open')
        ]
        
        # Total complaints in last 7 days
        start_7d = current_date - timedelta(days=7)
        recent_complaints = area_complaints[
            (area_complaints['date'] > start_7d) & 
            (area_complaints['date'] <= current_date)
        ]
        
        features.append({
            'area': area,
            'date': row['date'],
            'open_sanitation_complaints': len(open_complaints),
            'total_sanitation_complaints_last_7d': len(recent_complaints)
        })
    
    features_df = pd.DataFrame(features)
    
    print(f"✓ Engineered 2 sanitation features")
    
    return features_df


def engineer_environmental_features(environmental_df, grid):
    """
    Engineer environmental features
    
    Features:
    - avg_pm25_last_7d: Average PM2.5 in last 7 days
    - avg_pm10_last_7d: Average PM10 in last 7 days
    - max_pm25_last_7d: Maximum PM2.5 spike
    
    Returns:
        pd.DataFrame: Environmental features
    """
    print("🌍 Engineering environmental features...")
    
    environmental_df = environmental_df.copy()
    environmental_df['date'] = environmental_df['recordedDate'].dt.date
    
    # Filter only air quality data
    air_df = environmental_df[environmental_df['type'] == 'air'].copy()
    
    features = []
    
    for _, row in grid.iterrows():
        area = row['area']
        current_date = row['date'].date()
        
        # Last 7 days window
        start_7d = current_date - timedelta(days=7)
        area_air = air_df[
            (air_df['area'] == area) & 
            (air_df['date'] > start_7d) & 
            (air_df['date'] <= current_date)
        ]
        
        # Calculate aggregates
        avg_pm25 = area_air['pm25'].mean() if len(area_air) > 0 else 0
        avg_pm10 = area_air['pm10'].mean() if len(area_air) > 0 else 0
        max_pm25 = area_air['pm25'].max() if len(area_air) > 0 else 0
        
        features.append({
            'area': area,
            'date': row['date'],
            'avg_pm25_last_7d': avg_pm25,
            'avg_pm10_last_7d': avg_pm10,
            'max_pm25_last_7d': max_pm25
        })
    
    features_df = pd.DataFrame(features)
    
    print(f"✓ Engineered 3 environmental features")
    
    return features_df


def create_target_variable(health_df, grid):
    """
    Create target variable: outbreak in next 7 days
    
    Outbreak definition:
    - outbreak = 1 if health incidents in next 7 days > OUTBREAK_THRESHOLD
    - outbreak = 0 otherwise
    
    Returns:
        pd.DataFrame: Grid with target variable
    """
    print(f"🎯 Creating target variable (threshold={OUTBREAK_THRESHOLD} cases)...")
    
    health_df = health_df.copy()
    health_df['date'] = health_df['reportedDate'].dt.date
    
    targets = []
    
    for _, row in grid.iterrows():
        area = row['area']
        current_date = row['date'].date()
        
        # Next 7 days window
        end_date = current_date + timedelta(days=7)
        
        future_incidents = health_df[
            (health_df['area'] == area) & 
            (health_df['date'] > current_date) & 
            (health_df['date'] <= end_date)
        ]
        
        outbreak = 1 if len(future_incidents) > OUTBREAK_THRESHOLD else 0
        
        targets.append({
            'area': area,
            'date': row['date'],
            'outbreak': outbreak
        })
    
    targets_df = pd.DataFrame(targets)
    
    outbreak_count = targets_df['outbreak'].sum()
    print(f"✓ Created target: {outbreak_count} outbreaks ({outbreak_count/len(targets_df)*100:.1f}%)")
    
    return targets_df


def merge_all_features(grid, health_features, sanitation_features, environmental_features, targets):
    """
    Merge all features into final dataset
    
    Returns:
        pd.DataFrame: Complete feature dataset with target
    """
    print("🔗 Merging all features...")
    
    # Start with grid
    final_df = grid.copy()
    
    # Merge health features
    final_df = final_df.merge(
        health_features,
        on=['area', 'date'],
        how='left'
    )
    
    # Merge sanitation features
    final_df = final_df.merge(
        sanitation_features,
        on=['area', 'date'],
        how='left'
    )
    
    # Merge environmental features
    final_df = final_df.merge(
        environmental_features,
        on=['area', 'date'],
        how='left'
    )
    
    # Merge target
    final_df = final_df.merge(
        targets,
        on=['area', 'date'],
        how='left'
    )
    
    # Fill NaN values with 0
    final_df = final_df.fillna(0)
    
    print(f"✓ Final dataset shape: {final_df.shape}")
    print(f"✓ Features: {final_df.columns.tolist()}")
    
    return final_df


def preprocess_data():
    """
    Main preprocessing pipeline
    
    Returns:
        pd.DataFrame: Preprocessed dataset ready for ML
    """
    print("\n" + "="*60)
    print("🚀 OUTBREAK PREDICTION: DATA PREPROCESSING PIPELINE")
    print("="*60 + "\n")
    
    # Load datasets
    health_df, sanitation_df, environmental_df = load_datasets()
    
    # Create area-date grid
    grid = create_area_date_grid(health_df, sanitation_df, environmental_df)
    
    # Engineer features
    health_features = engineer_health_features(health_df, grid)
    sanitation_features = engineer_sanitation_features(sanitation_df, grid)
    environmental_features = engineer_environmental_features(environmental_df, grid)
    
    # Create target variable
    targets = create_target_variable(health_df, grid)
    
    # Merge all features
    final_dataset = merge_all_features(
        grid, 
        health_features, 
        sanitation_features, 
        environmental_features, 
        targets
    )
    
    print("\n" + "="*60)
    print("✅ PREPROCESSING COMPLETED SUCCESSFULLY")
    print("="*60)
    
    return final_dataset


if __name__ == "__main__":
    # Run preprocessing
    dataset = preprocess_data()
    
    # Save to CSV for inspection
    output_path = 'preprocessed_data.csv'
    dataset.to_csv(output_path, index=False)
    print(f"\n💾 Saved preprocessed data to {output_path}")
    
    # Display sample
    print("\n📋 Sample records:")
    print(dataset.head(10))
    
    # Display statistics
    print("\n📊 Dataset statistics:")
    print(dataset.describe())
