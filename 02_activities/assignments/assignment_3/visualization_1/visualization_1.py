#%%
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.gridspec import GridSpec
import re
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Fix the base URL (it had a string concatenation error)
base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca"

# Get the data
url = base_url + "/api/3/action/package_show"
params = {"id": "neighbourhood-crime-rates"}
package = requests.get(url, params=params).json()

# Extract the data
data = None
for idx, resource in enumerate(package["result"]["resources"]):
    if resource["datastore_active"]:
        url = base_url + "/api/3/action/datastore_search"
        p = {"id": resource["id"], "limit": 1000}  # Increased limit to get all neighborhoods
        resource_data = requests.get(url, params=p).json()["result"]["records"]
        data = pd.DataFrame(resource_data)
        break

# Clean the data
# Drop the geometry column if it exists
if 'geometry' in data.columns:
    data = data.drop('geometry', axis=1)
print("Data columns after dropping geometry:", data.columns)
print(data.iloc[0:5, 0:5]) 

#%%
# Function to get the latest year with data
def get_latest_year(df):
    rate_columns = [col for col in df.columns if '_RATE_' in col]
    years = sorted([int(re.search(r'\d{4}', col).group()) for col in rate_columns])
    years = [y for y in years]
    return max(years)

latest_year = get_latest_year(data)

print(f"Latest year with data: {latest_year}")
#%%
# Define crime types
crime_types = ['ASSAULT', 'AUTOTHEFT', 'BIKETHEFT', 'BREAKENTER', 
    'HOMICIDE', 'ROBBERY', 'SHOOTING', 'THEFTFROMMV', 'THEFTOVER']

# Create a new dataframe with just the crime rates for the latest year
latest_rates = pd.DataFrame()
latest_rates['HOOD_ID'] = data['HOOD_ID']
latest_rates['AREA_NAME'] = data['AREA_NAME']

for crime in crime_types:
    col_name = f"{crime}_RATE_{latest_year}"
    if col_name in data.columns:
        latest_rates[crime] = data[col_name]

print('Latest rates for each crime type:')
print(latest_rates.head())

#%%
#TODO: change format to make it more accessible

plt.figure(figsize=(20, 30))
gs = GridSpec(2, 1, figure=plt.gcf(), height_ratios=[0.7, 1.5])

# Pannel A: Crime Rate Distribution Over Time with Dual Y-axes
# Extract all available years from the data
rate_columns = [col for col in data.columns if '_RATE_' in col]
all_years = sorted(list(set([int(re.search(r'\d{4}', col).group()) for col in rate_columns])))
# print(f"Available years: {all_years}")

# Create a DataFrame to store yearly averages for each crime type
yearly_crime_data = pd.DataFrame(index=all_years)

# Populate the DataFrame with average rates for each crime type by year
for crime in crime_types:
    yearly_avgs = []
    for year in all_years:
        col = f"{crime}_RATE_{year}"
        if col in data.columns:
            yearly_avgs.append(data[col].mean())
        else:
            yearly_avgs.append(np.nan)
    
    # Fill NaN values with 0
    yearly_crime_data[crime] = pd.Series(yearly_avgs, index=all_years).fillna(0)

# Separate high and low frequency crimes for dual y-axis
# Calculate average rate for each crime type across all years
crime_avgs = yearly_crime_data.mean().sort_values(ascending=False)
high_freq_crimes = crime_avgs.nlargest(4).index.tolist()
low_freq_crimes = [c for c in crime_types if c not in high_freq_crimes]

# Define bright and dark color palettes
bright_colors = ['#FF5733', '#00e629', '#3357FF', '#FF33F5']  # Bright colors for left axis
dark_colors = ['#8B0000', '#006400', '#00008B', '#8B008B', '#8B4500']  # Dark colors for right axis

# Plot the time series with dual y-axes
ax1 = plt.subplot(gs[0])
ax2 = ax1.twinx()  # Create a second y-axis

# Plot high frequency crimes on the left y-axis with bright colors and filled markers
for i, crime in enumerate(high_freq_crimes):
    marker_styles = ['o', 's', 'D', '^']  # circle, square, diamond, triangle
    ax1.plot(yearly_crime_data.index, yearly_crime_data[crime], 
        marker=marker_styles[i % len(marker_styles)], 
        linestyle='-', 
        linewidth=3.5, 
        markersize=18, 
        markerfacecolor=bright_colors[i % len(bright_colors)],  # filled markers
        markeredgecolor=bright_colors[i % len(bright_colors)],
        color=bright_colors[i % len(bright_colors)],
        label=f"{crime} (left axis)")

# Plot low frequency crimes on the right y-axis with dark colors and hollow markers
for i, crime in enumerate(low_freq_crimes):
    marker_styles = ['o', 's', 'D', 'v', '>']  # circle, square, diamond, triangle down, triangle right
    ax2.plot(yearly_crime_data.index, yearly_crime_data[crime], 
        marker=marker_styles[i % len(marker_styles)], 
        linestyle='--', 
        linewidth=3.5, 
        markersize=18, 
        markerfacecolor='white',  # hollow markers
        markeredgecolor=dark_colors[i % len(dark_colors)],
        markeredgewidth=2,
        color=dark_colors[i % len(dark_colors)],
        label=f"{crime} (right axis)")

# Set labels and title
ax1.set_xlabel('Year', fontsize=22)
ax1.set_ylabel('Rate per 100,000 Population\n(High Frequency Crimes)', fontsize=22, color='#0052ff')
ax2.set_ylabel('Rate per 100,000 Population\n(Low Frequency Crimes)', fontsize=22, color='#8B0000')
ax1.set_title('Toronto Crime Rate Trends Over Time (2014-2023)', fontsize=26, fontweight='bold')

# Customize ticks
ax1.tick_params(axis='y', labelcolor='#0052ff', labelsize=20)
ax2.tick_params(axis='y', labelcolor='#8B0000', labelsize=20)
ax1.tick_params(axis='x', labelsize=20)

# Add a combined legend
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper center', bbox_to_anchor=(0.5, -0.15), 
    ncol=3, fontsize=22, frameon=True, facecolor='#F5F5F5', edgecolor='black')

# 2. PCA Visualization of Neighborhoods and Crime Types
ax3 = plt.subplot(gs[1])

# Prepare data for PCA
# Fill NaN values with 0
crime_data_for_pca = latest_rates[crime_types].fillna(0)

# Standardize the data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(crime_data_for_pca)

# Apply PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform(scaled_data)

# Create a DataFrame with PCA results
pca_df = pd.DataFrame(data=pca_result, columns=['PC1', 'PC2'])
pca_df['AREA_NAME'] = latest_rates['AREA_NAME']

# Calculate distance from origin for outlier detection
pca_df['distance'] = np.sqrt(pca_df['PC1']**2 + pca_df['PC2']**2)

# Determine outliers (neighborhoods with significant correlation with crime)
# Using 1.5 IQR method for outlier detection
Q1 = pca_df['distance'].quantile(0.25)
Q3 = pca_df['distance'].quantile(0.75)
IQR = Q3 - Q1
outlier_threshold = Q3 + 1.5 * IQR
outliers = pca_df['distance'] > outlier_threshold

# Plot neighborhood scores (dots) with different colors for outliers
ax3.scatter(pca_df.loc[~outliers, 'PC1'], pca_df.loc[~outliers, 'PC2'], 
    alpha=0.8, s=100, color='#3498db', label='Regular Neighborhoods')
ax3.scatter(pca_df.loc[outliers, 'PC1'], pca_df.loc[outliers, 'PC2'], 
    alpha=0.9, s=140, color='#e74c3c', label='Outlier Neighborhoods')

# Add neighborhood labels for outliers
# Label all outliers
for idx, row in pca_df[outliers].iterrows():
    ax3.annotate(row['AREA_NAME'], (row['PC1'], row['PC2']), 
    fontsize=20, fontweight='bold', color='#e74c3c',
    xytext=(7, 7), textcoords='offset points')

# Calculate scaling factor to normalize arrows
# Find the maximum distance in the scatter plot
max_score_distance = np.max(pca_df['distance'])
# Find the maximum loading magnitude
loadings = pca.components_.T
loading_distances = np.sqrt(loadings[:, 0]**2 + loadings[:, 1]**2)
max_loading_distance = np.max(loading_distances)
# Calculate scaling factor to make arrows use more of the range
# We use arrows to extend to a fraction of the maximum score distance
scaling_factor = 0.8 * max_score_distance / max_loading_distance

# Plot loadings (arrows) with the scaling factor
arrow_colors = ['#9b59b6', '#2ecc71', '#f39c12', '#1abc9c', '#d35400', '#27ae60', '#c0392b', '#16a085', '#f1c40f']
for i, crime in enumerate(crime_types):
    ax3.arrow(0, 0, loadings[i, 0] * scaling_factor, loadings[i, 1] * scaling_factor, 
        head_width=max_score_distance * 0.05, 
        head_length=max_score_distance * 0.05, 
        fc=arrow_colors[i % len(arrow_colors)], 
        ec=arrow_colors[i % len(arrow_colors)], 
        linewidth=3.5,
        alpha=0.8)
    
    # Position the text at the end of the arrow
    text_x = loadings[i, 0] * scaling_factor * 1.1
    text_y = loadings[i, 1] * scaling_factor * 1.1
    
    ax3.text(text_x, text_y, crime, 
        color=arrow_colors[i % len(arrow_colors)], 
        fontsize=22, fontweight='bold',
        ha='center', va='center',
        bbox=dict(facecolor='white', alpha=0.7, edgecolor=arrow_colors[i % len(arrow_colors)], boxstyle='round,pad=0.5'))

# Set labels and title
ax3.set_xlabel(f'Principal Component 1 ({pca.explained_variance_ratio_[0]:.2%} variance explained)', fontsize=26)
ax3.set_ylabel(f'Principal Component 2 ({pca.explained_variance_ratio_[1]:.2%} variance explained)', fontsize=26)
ax3.set_title('PCA of Toronto Neighborhoods by Crime Types', fontsize=28, fontweight='bold')

ax3.tick_params(axis='x', labelsize=24)
ax3.tick_params(axis='y', labelsize=24)

# Add grid
ax3.grid(True, linestyle='--', alpha=0.7)

# Add origin lines
ax3.axhline(y=0, color='k', linestyle='-', alpha=0.3)
ax3.axvline(x=0, color='k', linestyle='-', alpha=0.3)

# Add legend for neighborhood types
ax3.legend(fontsize=22, loc='upper right')

# Make sure axes are equal for better interpretation of directions
ax3.set_aspect('equal', adjustable='box')

# Increase tick label size
ax3.tick_params(axis='both', labelsize=16)

plt.tight_layout()
plt.subplots_adjust(hspace=0.4)

# Display dashboard
plt.savefig('toronto_crime_analysis.png', dpi=300, bbox_inches='tight')
plt.show()

#%%
# Print some summary statistics
print(f"\nSummary Statistics for Crime Rates in Toronto ({latest_year}):")
print(latest_rates[crime_types].describe())

# Print PCA explained variance
print("\nPCA Explained Variance Ratio:")
print(pca.explained_variance_ratio_)
print(f"Total variance explained by first two components: {sum(pca.explained_variance_ratio_):.2%}")

#%%