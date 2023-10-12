// Render the water system details
function renderWaterSystemDetails(data) {
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    detailsDiv.innerHTML = `
        <div><strong>${data.pws_name}</strong>&nbsp;<small>${data.pwsid}</small></div>
        <div>
        <strong>Population Served:</strong> ${data.population_served_count}<br>
        <strong>Service Connections:</strong> ${data.service_connections_count}<br>
        <strong>Owner Type:</strong> ${DATA_DICTIONARY['OWNER_TYPE'][data.owner_type_code]}<br>
        <strong>Primary Water Source:</strong> ${DATA_DICTIONARY['PRIMARY_SOURCE'][data.primary_source_code]}<br>
        </div>
    `;

    const panel = document.querySelector('.system-detail-container');
    panel.innerHTML = "";
    panel.appendChild(detailsDiv);
}

function sortBySamplingStartDate(jsonData) {
    return jsonData.sort((a, b) => new Date(a.sampling_start_date) - new Date(b.sampling_start_date));
}

// Render LCR Sample Results
function renderLCRSampleResults(lcrSampleData) {
    var sortedData = sortBySamplingStartDate(lcrSampleData);
    
    sortedData.forEach(sample => {
        sample.sample_measure = sample.sample_measure * 1000; // Convert from mg/L to ppb
    });

    // Create SVG canvas
    const margin = { top: 40, right: 20, bottom: 30, left: 50 },
        width = 300 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    const svg = d3.select('.system-detail-container').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    

    sortedData.forEach(d => {
        d.date = new Date(d.sampling_start_date);
    });

    // Set the scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const valueline = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.sample_measure));

    // Define the area
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.sample_measure));

    // Scale the range of the data
    x.domain(d3.extent(sortedData, d => d.date));
    y.domain([0, d3.max(sortedData, d => d.sample_measure)]);

    // Add the filled area
    svg.append("path")
        .data([sortedData])
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "rgba(71, 126, 214, 0.75)"); // The color you wanted

    // Add the valueline path
    svg.append("path")
        .data([sortedData])
        .attr("class", "line")
        .attr("d", valueline)
        .attr("fill", "none")
        .attr("stroke", "rgb(71, 126, 214)");

    // Add the X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")  
        .attr("transform", "rotate(-45)")  // Rotate the text by -45 degrees
        .style("text-anchor", "end")       // Anchor the text at the end so it rotates correctly
        .attr("dx", "-.8em")               // Adjust position to prevent overlap with the axis line
        .attr("dy", ".15em");

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // // Add the X Axis label
    // svg.append("text")             
    //     .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 16) + ")")
    //     .style("text-anchor", "middle")
    //     .style("font-size", "10px")
    //     .text("Sampling Date");

    // Add the Y Axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("ppb");

    // Add the title
    svg.append("text")
        .attr("x", width / 2)             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("font-weight", "bold")  
        .text("90th Percentile Lead Levels");
}

// Render Violations
function sortByCompliancePeriodDate(jsonData) {
    return jsonData.sort((a, b) => new Date(b.compl_per_begin_date) - new Date(a.compl_per_begin_date));
}

function renderViolations(violations) {
    
    violations = sortByCompliancePeriodDate(violations);
    
    const panel = document.querySelector('.panel');
    
    // Title
    const title = document.createElement('h3');
    title.textContent = 'Drinking Water Violations:';
    panel.appendChild(title);

    // Violation Count
    const count = document.createElement('p');
    var earliestCBD = violations[violations.length-1].compl_per_begin_date;
    var earliestCBDYear = new Date(earliestCBD).getFullYear();
    
    var countOpen = 0;
    violations.forEach(violation => { if (violation.compliance_status_code!='R') { countOpen+=1; }});

    count.textContent = `${violations.length} violations in the since ${earliestCBDYear}, ${countOpen} open.`;
    panel.appendChild(count);

    const violationWrapper = document.createElement('div');
    violationWrapper.className = 'cu-table-wrapper';
    
    const violationTable = document.createElement('table');
    violationTable.className = 'cu-table';
    violationWrapper.appendChild(violationTable);

    const tableHeaderRow = document.createElement('tr');
    
    ["Violation","Rule","Status","Health-Based","Date"].forEach(h => {
        var th = document.createElement('th');
        th.innerText = h;
        tableHeaderRow.appendChild(th);
    });
    violationTable.appendChild(tableHeaderRow);

    const violationBody = document.createElement('tbody');

    violations.forEach(violation => {
        var tr = document.createElement('tr');
        // Row for each violation
        ['violation_category_code',
         'rule_code',
         'compliance_status_code',
         'is_health_based_ind',
         'compl_per_begin_date'
        ].forEach(item => {
            var td = document.createElement('td');
            if (item=='compl_per_begin_date') {
                td.innerText = new Date(violation[item]).toLocaleDateString();
            } 
            else {
                td.innerText = DATA_DICTIONARY[item.toUpperCase()][violation[item]];
            }
            tr.appendChild(td);
        });
        violationBody.appendChild(tr);
    });
    violationTable.appendChild(violationBody);
    panel.appendChild(violationWrapper);
}


// Fetch the JSON data and render the information
// Assuming the data has already been fetched and is available as waterSystemData, lcrSampleData, violationData
function renderData(waterSystemData, lcrSampleData, violationData) {
    const panel = document.querySelector('.panel');
    panel.innerHTML = "";
    renderWaterSystemDetails(waterSystemData[0]);
    renderLCRSampleResults(lcrSampleData);
    renderViolations(violationData);
}

// Call the renderData function with the provided data
// renderData(WATER_SYSTEM, LCR_SAMPLE, VIOLATION);
