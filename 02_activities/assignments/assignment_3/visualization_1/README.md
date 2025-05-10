# Toronto Crime Rate Visualization

This visualization project analyzes crime rates across Toronto neighborhoods using data from the City of Toronto's Open Data Portal. The analysis includes time series trends of different crime types from 2014-2023 and a Principal Component Analysis (PCA) to identify patterns and outlier neighborhoods.

## Description

The visualization consists of two main components:

1. **Time Series Analysis**: Shows crime rate trends over time (2014-2023) with a dual y-axis plot that separates high-frequency and low-frequency crimes for better visibility.

2. **PCA Visualization**: Performs dimensionality reduction on neighborhood crime data to identify patterns and outlier neighborhoods. The visualization includes:
   - Scatter plot of neighborhoods in PCA space
   - Vectors showing the influence of different crime types
   - Highlighted outlier neighborhoods with labels

The final output is saved as a high-resolution image file (`toronto_crime_analysis.png`).

## Data Source

The data is fetched directly from the City of Toronto's Open Data Portal using their API:
- Dataset: "Neighbourhood Crime Rates"
- URL: https://ckan0.cf.opendata.inter.prod-toronto.ca

The visualization automatically retrieves the most recent data available and identifies the latest year with complete crime statistics.

## Requirements

To run this visualization, you need the following Python packages:

- Python 3.6+
- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn
- requests
