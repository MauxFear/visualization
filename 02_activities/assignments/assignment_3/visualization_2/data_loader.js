// Data loader for Toronto Crime Map Visualization

// Global variables to store data
let crimeData = [];
let torontoGeoData = null;
let years = [];
let crimeTypes = ['ASSAULT', 'AUTOTHEFT', 'BIKETHEFT', 'BREAKENTER', 
                 'HOMICIDE', 'ROBBERY', 'SHOOTING', 'THEFTFROMMV', 'THEFTOVER'];

// Function to load crime data from local file
async function loadCrimeData() {
    try {
        // Load from local data file
        const response = await fetch('data/crime_data.json');
        if (!response.ok) {
            throw new Error(`Failed to load crime data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Successfully loaded crime data:", data.length, "records");
        return data;
    } catch (error) {
        console.error("Error loading crime data:", error);
        
        // Try loading sample data as fallback
        try {
            const fallbackResponse = await fetch('data/sample_crime_data.json');
            if (!fallbackResponse.ok) {
                throw new Error(`Failed to load sample data: ${fallbackResponse.status}`);
            }
            const fallbackData = await fallbackResponse.json();
            console.log("Using sample crime data:", fallbackData.length, "records");
            return fallbackData;
        } catch (fallbackError) {
            console.error("Fallback data also failed:", fallbackError);
            return [];
        }
    }
}

// Function to load Toronto neighborhood boundaries
async function loadTorontoGeoData() {
    try {
        // Try to create a simple GeoJSON from crime data
        // This is a temporary solution until proper GeoJSON is available
        const geoData = {
            type: "FeatureCollection",
            features: crimeData.map(item => {
                // Check if the item has geometry data
                let geometry = null;
                if (item.geometry) {
                    try {
                        // Try to parse the geometry if it's a string
                        if (typeof item.geometry === 'string') {
                            geometry = JSON.parse(item.geometry);
                        } else {
                            geometry = item.geometry;
                        }
                    } catch (e) {
                        console.error("Error parsing geometry:", e);
                    }
                }
                
                return {
                    type: "Feature",
                    properties: {
                        HOOD_ID: item.HOOD_ID,
                        AREA_NAME: item.AREA_NAME
                    },
                    geometry: geometry
                };
            }).filter(feature => feature.geometry !== null)
        };
        
        if (geoData.features.length > 0) {
            console.log("Created GeoJSON from crime data with", geoData.features.length, "features");
            return geoData;
        } else {
            throw new Error("No valid geometry data found in crime data");
        }
    } catch (error) {
        console.error("Error creating GeoJSON:", error);
        
        // Create a simple placeholder GeoJSON with rectangles for each neighborhood
        // This is just for visualization purposes when no proper geometry is available
        const placeholderGeoData = {
            type: "FeatureCollection",
            features: crimeData.map((item, index) => {
                // Create a simple rectangle for each neighborhood
                // Position them in a grid layout
                const row = Math.floor(index / 10);
                const col = index % 10;
                const size = 0.01;
                const baseX = -79.4;
                const baseY = 43.7;
                
                return {
                    type: "Feature",
                    properties: {
                        HOOD_ID: item.HOOD_ID,
                        AREA_NAME: item.AREA_NAME
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [[
                            [baseX + col * size, baseY + row * size],
                            [baseX + (col + 1) * size, baseY + row * size],
                            [baseX + (col + 1) * size, baseY + (row + 1) * size],
                            [baseX + col * size, baseY + (row + 1) * size],
                            [baseX + col * size, baseY + row * size]
                        ]]
                    }
                };
            })
        };
        
        console.log("Created placeholder GeoJSON with", placeholderGeoData.features.length, "features");
        return placeholderGeoData;
    }
}

// Function to process crime data
function processCrimeData(data) {
    // Make a deep copy to avoid modifying the original data
    const processedData = JSON.parse(JSON.stringify(data));
    
    // Extract years from column names
    const yearPattern = /_RATE_(\d{4})|_(\d{4})$/;
    const yearSet = new Set();
    
    // Get all column names
    if (processedData.length > 0) {
        const sampleItem = processedData[0];
        Object.keys(sampleItem).forEach(key => {
            const match = key.match(yearPattern);
            if (match) {
                const year = match[1] || match[2];
                yearSet.add(parseInt(year));
            }
        });
    }
    
    // Sort years
    years = Array.from(yearSet).sort();
    console.log("Years found in data:", years);
    
    // Fill in missing count values based on rates and population
    processedData.forEach(item => {
        years.forEach(year => {
            // Get population for this neighborhood and year if available
            let population = item[`POPULATION_${year}`];
            if (!population && item.POPULATION_2024) {
                // Use the most recent population as fallback
                population = item.POPULATION_2024;
            }
            
            // Default population if none is available
            if (!population || isNaN(parseInt(population))) {
                population = 10000; // Default population estimate
            } else {
                population = parseInt(population);
            }
            
            // Process each crime type
            crimeTypes.forEach(crimeType => {
                const rateKey = `${crimeType}_RATE_${year}`;
                const countKey = `${crimeType}_COUNT_${year}`;
                const crimeKey = `${crimeType}_${year}`;
                
                // Check if we have the raw count
                if (item[crimeKey] !== undefined && item[crimeKey] !== null) {
                    const count = parseInt(item[crimeKey]);
                    if (!isNaN(count)) {
                        // We have the count, calculate rate if missing
                        item[countKey] = count;
                        if (item[rateKey] === undefined || item[rateKey] === null || isNaN(parseFloat(item[rateKey]))) {
                            item[rateKey] = (count / population) * 100000;
                        }
                    }
                } 
                // If we have rate but no count, calculate count
                else if (item[rateKey] !== undefined && item[rateKey] !== null) {
                    const rate = parseFloat(item[rateKey]);
                    if (!isNaN(rate)) {
                        if (item[countKey] === undefined || item[countKey] === null || isNaN(parseInt(item[countKey]))) {
                            // Calculate count from rate
                            const calculatedCount = Math.round((rate * population) / 100000);
                            item[countKey] = calculatedCount;
                        }
                    }
                }
                
                // Ensure we have at least zeros for missing data
                if (item[rateKey] === undefined || item[rateKey] === null || isNaN(parseFloat(item[rateKey]))) {
                    item[rateKey] = 0;
                }
                if (item[countKey] === undefined || item[countKey] === null || isNaN(parseInt(item[countKey]))) {
                    item[countKey] = 0;
                }
            });
            
            // Calculate totals
            let totalRate = 0;
            let totalCount = 0;
            
            crimeTypes.forEach(crimeType => {
                const rateKey = `${crimeType}_RATE_${year}`;
                const countKey = `${crimeType}_COUNT_${year}`;
                
                // Add to totals (values should be numbers now)
                totalRate += parseFloat(item[rateKey]);
                totalCount += parseInt(item[countKey]);
            });
            
            // Add total crime rate and count for each year
            item[`ALL_RATE_${year}`] = totalRate;
            item[`ALL_COUNT_${year}`] = totalCount;
        });
    });
    
    return processedData;
}

// Function to populate dropdowns
function populateDropdowns() {
    // Populate year dropdown
    const yearSelect = document.getElementById('year-select');
    yearSelect.innerHTML = '';
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    
    // Select the latest year by default
    if (years.length > 0) {
        yearSelect.value = years[years.length - 1];
    }
    
    // Populate crime type dropdown
    const crimeSelect = document.getElementById('crime-select');
    
    // Clear existing options except the first one (ALL)
    while (crimeSelect.options.length > 1) {
        crimeSelect.remove(1);
    }
    
    // Add crime types
    crimeTypes.forEach(crimeType => {
        const option = document.createElement('option');
        option.value = crimeType;
        option.textContent = formatCrimeType(crimeType);
        crimeSelect.appendChild(option);
    });
}

// Helper function to format crime type for display
function formatCrimeType(crimeType) {
    // Convert UPPERCASE to Title Case and replace specific abbreviations
    const formatted = crimeType.toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())
        .replace('Autotheft', 'Auto Theft')
        .replace('Biketheft', 'Bike Theft')
        .replace('Breakenter', 'Break & Enter')
        .replace('Theftfrommv', 'Theft from Motor Vehicle')
        .replace('Theftover', 'Theft Over $5000');
    
    return formatted;
}

// Main function to load all data
async function loadAllData() {
    try {
        // Show loading indicator
        document.getElementById('map').innerHTML = '<div class="loading">Loading data...</div>';
        
        // Load crime data from local file
        const rawCrimeData = await loadCrimeData();
        
        if (rawCrimeData && rawCrimeData.length > 0) {
            // Process crime data
            crimeData = processCrimeData(rawCrimeData);
            console.log("Processed crime data:", crimeData.length, "records");
            
            // Load Toronto geo data
            torontoGeoData = await loadTorontoGeoData();
            
            if (torontoGeoData) {
                // Populate dropdowns
                populateDropdowns();
                
                // Initialize map (check if function exists first)
                if (typeof initMap === 'function') {
                    initMap();
                    
                    // Force a redraw after a short delay to ensure colors are applied correctly
                    setTimeout(() => {
                        if (typeof drawMap === 'function' && typeof mapInitialized !== 'undefined' && mapInitialized) {
                            // Force a complete redraw to ensure all event handlers are properly attached
                            drawMap();
                            
                            // Add a small delay and do another redraw to ensure everything is properly rendered
                            setTimeout(() => {
                                if (typeof drawMap === 'function') {
                                    drawMap();
                                }
                            }, 200);
                        }
                    }, 300);
                } else {
                    console.error("initMap function not found. Make sure map_script.js is loaded properly.");
                    // Try again after a short delay to allow scripts to load
                    setTimeout(() => {
                        if (typeof initMap === 'function') {
                            initMap();
                        } else {
                            console.error("initMap function still not available after delay.");
                        }
                    }, 500);
                }
                
                // Add event listeners to dropdowns
                if (typeof updateMap === 'function') {
                    document.getElementById('year-select').addEventListener('change', updateMap);
                    document.getElementById('crime-select').addEventListener('change', updateMap);
                } else {
                    console.error("updateMap function not found. Make sure map_script.js is loaded properly.");
                }
            } else {
                throw new Error("Failed to load or create Toronto geo data");
            }
        } else {
            throw new Error("No crime data records found");
        }
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('map').innerHTML = `<div class="error">Error loading data: ${error.message}</div>`;
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadAllData);