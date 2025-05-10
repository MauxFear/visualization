// Map visualization for Toronto Crime Map

// Check if formatCrimeType is defined, if not define it
if (typeof formatCrimeType !== 'function') {
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
}

// Global variables for the map
let svg;
let projection;
let path;
let colorScale;
let tooltip;
let currentYear;
let currentCrimeType;
let mapInitialized = false;
let legendWidth = 500; 

// Define color schemes for each crime type
const crimeTypeColors = {
    'ALL': d3.interpolateReds,
    'ASSAULT': d3.interpolateBlues,
    'AUTOTHEFT': d3.interpolateGreens,
    'BIKETHEFT': d3.interpolateOranges,
    'BREAKENTER': d3.interpolatePurples,
    'HOMICIDE': d3.interpolateReds,
    'ROBBERY': d3.interpolateYlOrBr,
    'SHOOTING': d => d3.interpolateRgb("#f0f0ff", "#8000ff")(d), // Custom light-to-dark purple scale
    'THEFTFROMMV': d3.interpolateYlGnBu,
    'THEFTOVER': d3.interpolateYlOrRd
};

// Function to initialize the map
function initMap() {
    if (!crimeData || !torontoGeoData || mapInitialized) return;
    
    // Set current selections
    currentYear = document.getElementById('year-select').value;
    currentCrimeType = document.getElementById('crime-select').value;
    
    // Clear previous content
    document.getElementById('map').innerHTML = '';
    
    // Set up dimensions
    const width = document.getElementById('map').clientWidth;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    
    // Create SVG
    svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');
    
    // Create a group for the map
    const g = svg.append('g');
    
    // Set up projection
    projection = d3.geoMercator()
        .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], torontoGeoData);
    
    // Set up path generator
    path = d3.geoPath().projection(projection);
    
    // Create tooltip 
    d3.select('body').selectAll('.tooltip').remove();
    tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Draw the map
    drawMap();
    
    // Create legend
    createLegend();
    
    mapInitialized = true;
}

// Function to draw the map
function drawMap() {
    // Clear previous neighborhoods and event handlers
    svg.selectAll('.neighborhood').on('mouseover', null).on('mouseout', null).on('click', null).remove();
    
    // Get data key based on crime type
    let dataKey;
    if (currentCrimeType === 'ALL') {
        dataKey = `ALL_RATE_${currentYear}`;
    } else {
        dataKey = `${currentCrimeType}_RATE_${currentYear}`;
    }
    
    // Create color scale based on crime rates
    // Get all valid rates for the selected crime type and year
    const rates = crimeData.map(d => {
        // Make sure we have a valid number
        const value = parseFloat(d[dataKey] || 0);
        return isNaN(value) ? 0 : value;
    }).filter(rate => rate >= 0); // Filter out any negative values
    
    // Calculate maximum rate based on crime type
    const nonZeroRates = rates.filter(rate => rate > 0);
    
    // For shooting data use actual max, for others use 98th percentile to avoid outliers
    let maxRate = currentCrimeType === 'SHOOTING' 
        ? d3.max(rates) || 1
        : (() => {
            const sortedRates = [...rates].sort((a, b) => a - b);
            const percentile98Index = Math.floor(sortedRates.length * 0.98);
            return sortedRates[percentile98Index] || d3.max(rates) || 1;
          })();
    
    // Ensure we have a reasonable maximum (at least 1)
    maxRate = Math.max(maxRate, 1);
    
    // Create a sequential color scale with the appropriate color scheme for the crime type
    const colorInterpolator = crimeTypeColors[currentCrimeType] || d3.interpolateReds;
    colorScale = d3.scaleSequential()
        .domain([0, maxRate])
        .interpolator(colorInterpolator);
    
    // Simplified approach: Draw neighborhoods with proper fill colors
    const neighborhoods = svg.selectAll('.neighborhood')
        .data(torontoGeoData.features)
        .enter()
        .append('path')
        .attr('class', 'neighborhood')
        .attr('d', path)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.8)
        .attr('fill', function(d) {
            // Find matching crime data for this neighborhood
            const hoodId = d.properties.HOOD_ID;
            const areaName = d.properties.AREA_NAME;
            
            // Try to match by ID first, then by name
            let neighborhoodData = crimeData.find(item => 
                (item.HOOD_ID !== undefined && item.HOOD_ID == hoodId) || 
                (item._id !== undefined && item._id == hoodId)
            );
            
            // If no match by ID, try matching by name
            if (!neighborhoodData && areaName) {
                neighborhoodData = crimeData.find(item => 
                    item.AREA_NAME && item.AREA_NAME.toLowerCase() === areaName.toLowerCase()
                );
            }
            
            // Default color for neighborhoods with no data
            if (!neighborhoodData) return '#ccc';
            
            // Get the rate value
            const value = parseFloat(neighborhoodData[dataKey] || 0);
            
            if (isNaN(value) || value < 0) return '#ccc';
            
            // Apply color scale with optimized handling for different crime types
            if (currentCrimeType === 'SHOOTING' && value > 0) {
                // For non-zero shooting values, ensure visibility with a minimum threshold
                const minVisibleValue = maxRate * 0.05;
                return colorScale(Math.min(Math.max(value, minVisibleValue), maxRate * 1.2));
            } else {
                // For zero shooting values and all other crime types
                return colorScale(Math.min(value, maxRate * 1.5));
            }
        });
    
    // Add event handlers with proper event binding
    neighborhoods.on('mouseover', function(event, d) {
        // Prevent default behavior
        event.preventDefault();
        
        // Highlight neighborhood
        d3.select(this)
            .attr('stroke', '#000')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 1);
            
        // Find matching crime data
        const hoodId = d.properties.HOOD_ID;
        const areaName = d.properties.AREA_NAME;
        
        // Try to match by ID first, then by name
        let neighborhoodData = crimeData.find(item => 
            (item.HOOD_ID !== undefined && item.HOOD_ID == hoodId) || 
            (item._id !== undefined && item._id == hoodId)
        );
        
        // If no match by ID, try matching by name
        if (!neighborhoodData && areaName) {
            neighborhoodData = crimeData.find(item => 
                item.AREA_NAME && item.AREA_NAME.toLowerCase() === areaName.toLowerCase()
            );
        }
        
        // Show tooltip
        if (neighborhoodData) {
            const areaName = neighborhoodData.AREA_NAME || d.properties.AREA_NAME || "Unknown Area";
            
            // Get the appropriate keys based on whether we're showing ALL crimes or a specific type
            let rateKey, countKey, displayName;
            
            if (currentCrimeType === 'ALL') {
                rateKey = `ALL_RATE_${currentYear}`;
                countKey = `ALL_COUNT_${currentYear}`;
                displayName = "All Crimes";
            } else {
                rateKey = `${currentCrimeType}_RATE_${currentYear}`;
                countKey = `${currentCrimeType}_COUNT_${currentYear}`;
                displayName = formatCrimeType(currentCrimeType);
            }
            
            // Get values (should be numbers now due to our preprocessing)
            const rate = parseFloat(neighborhoodData[rateKey] || 0).toFixed(2);
            const count = parseInt(neighborhoodData[countKey] || 0);
            
            // Get population if available
            let population = neighborhoodData[`POPULATION_${currentYear}`];
            if (!population && neighborhoodData.POPULATION_2024) {
                population = neighborhoodData.POPULATION_2024;
            }
            
            // Format population with commas
            let populationDisplay = '';
            if (population) {
                populationDisplay = `<p>Population: ${parseInt(population).toLocaleString()}</p>`;
            }
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(`
                <h3>${areaName}</h3>
                <p><strong>${displayName} (${currentYear})</strong></p>
                ${populationDisplay}
                <p>Rate per 100,000: ${rate}</p>
                <p>Total incidents: ${count}</p>
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            
            // Update info panel
            updateInfoPanel(neighborhoodData, areaName);
        }
    })
    .on('mouseout', function(event) {
        // Prevent default behavior
        event.preventDefault();
        
        // Remove highlight
        d3.select(this)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.8);
        
        // Hide tooltip
        tooltip.transition()
            .duration(200) // Faster transition
            .style('opacity', 0);
    })
    .on('click', function(event, d) {
        // Prevent default behavior
        event.preventDefault();
        
        // Find matching crime data
        const hoodId = d.properties.HOOD_ID;
        const areaName = d.properties.AREA_NAME;
        
        // Try to match by ID first, then by name
        let neighborhoodData = crimeData.find(item => 
            (item.HOOD_ID !== undefined && item.HOOD_ID == hoodId) || 
            (item._id !== undefined && item._id == hoodId)
        );
        
        // If no match by ID, try matching by name
        if (!neighborhoodData && areaName) {
            neighborhoodData = crimeData.find(item => 
                item.AREA_NAME && item.AREA_NAME.toLowerCase() === areaName.toLowerCase()
            );
        }
        
        if (neighborhoodData) {
            const areaName = neighborhoodData.AREA_NAME || d.properties.AREA_NAME || "Unknown Area";
            
            // Highlight the clicked neighborhood more prominently
            svg.selectAll('.neighborhood')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.8);
                
            d3.select(this)
                .attr('stroke', '#000')
                .attr('stroke-width', 2)
                .attr('stroke-opacity', 1);
                
            // Update the info panel
            updateInfoPanel(neighborhoodData, areaName);
        }
    });
    
    // Update legend
    updateLegend();
}

// Function to create the legend
function createLegend() {
    // Setup legend container and SVG
    const legendContainer = d3.select('#legend').html('');
    const legendHeight = 20;
    
    const legendSvg = legendContainer.append('svg')
        .attr('width', legendWidth)
        .attr('height', legendHeight + 60)
        .style('overflow', 'visible');
    
    // Create gradient definition
    legendSvg.append('defs')
        .append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
    
    // Create rectangle with gradient
    legendSvg.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#legend-gradient)');
    
    // Create axis placeholder
    legendSvg.append('g')
        .attr('class', 'legend-axis')
        .attr('transform', `translate(0, ${legendHeight})`);
    
    // Create crime type legend
    createCrimeTypeLegend();
}

// Function to create a legend showing all crime types and their colors
function createCrimeTypeLegend() {
    // Create a new container for the crime type legend
    const container = d3.select('.legend-container');
    
    // Remove any existing crime type legend
    container.selectAll('.crime-type-legend').remove();
    
    // Create a new div for the crime type legend
    const crimeTypeLegend = container.append('div')
        .attr('class', 'crime-type-legend')
        .style('margin-top', '20px')
        .style('display', 'flex')
        .style('flex-wrap', 'wrap')
        .style('justify-content', 'center')
        .style('gap', '10px');
    
    // Add a title
    crimeTypeLegend.append('div')
        .attr('class', 'crime-type-legend-title')
        .style('width', '100%')
        .style('text-align', 'center')
        .style('font-weight', 'bold')
        .style('margin-bottom', '5px')
        .text('Color by Crime Type');
    
    // Add the "All Crimes" option first
    const allCrimesDiv = crimeTypeLegend.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin', '3px')
        .style('padding', '3px 6px')
        .style('border-radius', '3px')
        .style('background-color', currentCrimeType === 'ALL' ? '#f0f0f0' : 'transparent')
        .style('cursor', 'pointer')
        .style('font-weight', 'bold')
        .style('border', '1px solid #ddd')
        .on('click', function() {
            // Update the crime type dropdown
            document.getElementById('crime-select').value = 'ALL';
            // Trigger the change event to update the map
            document.getElementById('crime-select').dispatchEvent(new Event('change'));
        });
    
    // Add a color swatch
    allCrimesDiv.append('div')
        .style('width', '15px')
        .style('height', '15px')
        .style('background-color', crimeTypeColors['ALL'](0.7))
        .style('margin-right', '5px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '3px');
    
    // Add the crime type name
    allCrimesDiv.append('span')
        .style('font-size', '12px')
        .text('All Crimes');
        
    // Add a separator
    crimeTypeLegend.append('div')
        .style('width', '100%')
        .style('height', '1px')
        .style('background-color', '#eee')
        .style('margin', '5px 0');
    
    // Add a color swatch for each crime type
    Object.keys(crimeTypeColors).forEach(crimeType => {
        // Skip the ALL type as it's already added
        if (crimeType === 'ALL') return;
        
        // Create a div for this crime type
        const crimeTypeDiv = crimeTypeLegend.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin', '3px')
            .style('padding', '3px')
            .style('border-radius', '3px')
            .style('background-color', currentCrimeType === crimeType ? '#f0f0f0' : 'transparent')
            .style('cursor', 'pointer')
            .on('click', function() {
                // Update the crime type dropdown
                document.getElementById('crime-select').value = crimeType;
                // Trigger the change event to update the map
                document.getElementById('crime-select').dispatchEvent(new Event('change'));
            });
        
        // Add a color swatch
        crimeTypeDiv.append('div')
            .style('width', '15px')
            .style('height', '15px')
            .style('background-color', crimeTypeColors[crimeType](0.7))
            .style('margin-right', '5px')
            .style('border', '1px solid #ccc')
            .style('border-radius', '3px');
        
        // Add the crime type name
        crimeTypeDiv.append('span')
            .style('font-size', '12px')
            .text(formatCrimeType(crimeType));
    });
}

// Function to update the legend
function updateLegend() {
    // Get data key based on crime type
    let dataKey;
    if (currentCrimeType === 'ALL') {
        dataKey = `ALL_RATE_${currentYear}`;
    } else {
        dataKey = `${currentCrimeType}_RATE_${currentYear}`;
    }
    
    // // Update the legend title will be done at the end of this function
    
    // Get all valid rates for the selected crime type and year
    const rates = crimeData.map(d => {
        // Make sure we have a valid number
        const value = parseFloat(d[dataKey] || 0);
        return isNaN(value) ? 0 : value;
    }).filter(rate => rate >= 0); // Filter out any negative values
    
    // Calculate maximum rate using the same logic as in drawMap
    const nonZeroRates = rates.filter(rate => rate > 0);
    
    // For shooting data use actual max, for others use 98th percentile
    let maxRate = currentCrimeType === 'SHOOTING' 
        ? d3.max(rates) || 1
        : (() => {
            const sortedRates = [...rates].sort((a, b) => a - b);
            const percentile98Index = Math.floor(sortedRates.length * 0.98);
            return sortedRates[percentile98Index] || d3.max(rates) || 1;
          })();
    
    // Ensure we have a reasonable maximum (at least 1)
    maxRate = Math.max(maxRate, 1);
    
    // Update gradient with optimized color stops
    const linearGradient = d3.select('#legend-gradient').selectAll('*').remove();
    
    // Add color stops efficiently
    d3.select('#legend-gradient')
        .selectAll('stop')
        .data(d3.range(11)) // 11 stops (0 to 10)
        .enter()
        .append('stop')
        .attr('offset', d => `${d * 10}%`)
        .attr('stop-color', d => colorScale(maxRate * d / 10));
    
    // Update axis with nice round numbers, but ensure we include the max value
    // First, determine a nice rounded max value that's at least as large as our actual max
    const niceMaxRate = Math.ceil(maxRate * 1.05); // Add 5% and round up to ensure we include the max
    
    // Create the scale with the nice max value
    const legendScale = d3.scaleLinear()
        .domain([0, niceMaxRate])
        .range([0, legendWidth]); // Using the global legendWidth variable
    
    // Update the crime type legend to highlight the current selection
    createCrimeTypeLegend();
    
        // Format tick labels based on data range - simplified
    const tickFormat = niceMaxRate >= 1000 ? d => (d >= 1000 ? `${(d/1000).toFixed(1)}K` : d.toFixed(0)) :
                      niceMaxRate >= 100 ? d => d.toFixed(0) :
                      niceMaxRate >= 10 ? d => d.toFixed(1) :
                      niceMaxRate >= 1 ? d => d.toFixed(2) :
                      niceMaxRate >= 0.1 ? d => d.toFixed(2).replace('0.', '.') :
                      d => d.toExponential(1);
    
    // Determine optimal tick count based on data range and crime type
    const tickCount = niceMaxRate < 0.1 ? 3 :
                     niceMaxRate < 1 ? 4 :
                     currentCrimeType === 'SHOOTING' ? 5 : 6;
    
    // Generate evenly spaced tick values from 0 to max
    let tickValues = Array.from({length: tickCount}, (_, i) => niceMaxRate * i / (tickCount - 1));
    
    // For shooting data with non-zero values, add the minimum non-zero value as a tick
    if (currentCrimeType === 'SHOOTING' && nonZeroRates.length > 0) {
        const minNonZero = d3.min(nonZeroRates);
        // Only add if significantly different from zero and not already included
        if (minNonZero > niceMaxRate * 0.05 && !tickValues.some(v => Math.abs(v - minNonZero) < 0.001)) {
            tickValues.push(minNonZero);
            tickValues.sort((a, b) => a - b);
        }
    }
    
    const legendAxis = d3.axisBottom(legendScale)
        .tickValues(tickValues)
        .tickFormat(tickFormat)
        .tickPadding(10) // Increased padding between ticks and labels
        .tickSize(6); // Slightly larger tick marks
    
    d3.select('.legend-axis')
        .call(legendAxis);
    
    // Update the legend title to show what we're displaying
    const crimeTypeDisplay = currentCrimeType === 'ALL' ? 'All Crimes' : formatCrimeType(currentCrimeType);
    d3.select('.legend-container h3')
        .text(`${crimeTypeDisplay} Rate per 100,000 Population (${currentYear})`);
}

// Function to update the info panel
function updateInfoPanel(neighborhoodData, areaName) {
    const infoPanel = document.getElementById('neighborhood-info');
    
    if (!neighborhoodData) {
        infoPanel.innerHTML = '<p>No data available for this neighborhood</p>';
        return;
    }
    
    // Get population if available
    let population = neighborhoodData[`POPULATION_${currentYear}`];
    if (!population && neighborhoodData.POPULATION_2024) {
        population = neighborhoodData.POPULATION_2024;
    }
    
    // Format population with commas
    let populationDisplay = 'Unknown';
    if (population) {
        populationDisplay = parseInt(population).toLocaleString();
    }
    
    // Get all crime rates for the current year
    let crimeInfo = '';
    crimeTypes.forEach(crimeType => {
        const rateKey = `${crimeType}_RATE_${currentYear}`;
        const countKey = `${crimeType}_COUNT_${currentYear}`;
        
        // Get values (should be numbers now due to our preprocessing)
        const rate = parseFloat(neighborhoodData[rateKey] || 0).toFixed(2);
        const count = parseInt(neighborhoodData[countKey] || 0);
        
        crimeInfo += `
            <tr>
                <td>${formatCrimeType(crimeType)}</td>
                <td>${rate}</td>
                <td>${count}</td>
            </tr>
        `;
    });
    
    // Get totals (should be numbers now due to our preprocessing)
    const totalRate = parseFloat(neighborhoodData[`ALL_RATE_${currentYear}`] || 0).toFixed(2);
    const totalCount = parseInt(neighborhoodData[`ALL_COUNT_${currentYear}`] || 0);
    
    // Get neighborhood ID (either HOOD_ID or _id)
    const neighborhoodId = neighborhoodData.HOOD_ID || neighborhoodData._id || 'Unknown';
    
    infoPanel.innerHTML = `
        <h3>${areaName || 'Unknown Area'}</h3>
        <p><strong>Neighborhood ID:</strong> ${neighborhoodId}</p>
        <p><strong>Year:</strong> ${currentYear}</p>
        <p><strong>Population:</strong> ${populationDisplay}</p>
        <table class="crime-table">
            <thead>
                <tr>
                    <th>Crime Type</th>
                    <th>Rate per 100,000</th>
                    <th>Total Incidents</th>
                </tr>
            </thead>
            <tbody>
                ${crimeInfo}
                <tr class="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>${totalRate}</strong></td>
                    <td><strong>${totalCount}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Function to update the map when selections change
function updateMap() {
    // Get the new selections
    const newYear = document.getElementById('year-select').value;
    const newCrimeType = document.getElementById('crime-select').value;
    
    // Check if anything changed
    if (newYear === currentYear && newCrimeType === currentCrimeType) {
        return; // No change, skip update
    }
    
    // Update current selections
    currentYear = newYear;
    currentCrimeType = newCrimeType;
    
    if (mapInitialized) {
        // Show loading indicator
        const mapContainer = document.getElementById('map');
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.textContent = 'Updating map...';
        mapContainer.appendChild(loadingOverlay);
        
        // Setting a timeout to allow the loading overlay to show
        setTimeout(() => {
            try {
                // Redraw the map with the new selections
                drawMap();
                
                // Update the legend
                updateLegend();
                
                // Update the page title to reflect the current selection
                const crimeTypeDisplay = currentCrimeType === 'ALL' ? 'All Crimes' : formatCrimeType(currentCrimeType);
                document.querySelector('h1').textContent = `Toronto ${crimeTypeDisplay} Rates (${currentYear})`;
                
                // Remove loading overlay
                const overlay = document.querySelector('.loading-overlay');
                if (overlay) overlay.remove();
            } catch (error) {
                console.error("Error updating map:", error);
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.textContent = `Error updating map: ${error.message}`;
                mapContainer.appendChild(errorDiv);
                
                // Remove loading overlay
                const overlay = document.querySelector('.loading-overlay');
                if (overlay) overlay.remove();
            }
        }, 50); // Short delay to allow UI update
    }
}