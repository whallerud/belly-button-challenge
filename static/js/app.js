// Build the metadata panel
function populateMetadata(selectedID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((jsonData) => {

    let metaInfo = jsonData.metadata;

    // Locate metadata for the chosen ID
    let filteredMeta = metaInfo.filter(entry => entry.id == selectedID);
    let metadataEntry = filteredMeta[0];

    // Select the metadata display panel
    let infoPanel = d3.select("#sample-metadata");

    // Clear any existing content
    infoPanel.html("");

    // Append each key-value pair as an h6 element
    for (let field in metadataEntry) {
      infoPanel.append("h6").text(`${field.toUpperCase()}: ${metadataEntry[field]}`);
    }
  });
}

function generateCharts(currentSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((jsonData) => {

    let sampleRecords = jsonData.samples;

    let matchingSample = sampleRecords.filter(record => record.id == currentSample)[0];

    let ids = matchingSample.otu_ids;
    let labels = matchingSample.otu_labels;
    let values = matchingSample.sample_values;

    // Bubble Chart setup
    let bubbleSettings = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };

    let bubblePlotData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        size: values,
        color: ids,
        colorscale: "Earth"
      }
    }];

    Plotly.newPlot("bubble", bubblePlotData, bubbleSettings);

    // Bar Chart setup
    let yLabels = ids.map(id => `OTU ${id}`);

    let barChartData = [{
      y: yLabels.slice(0, 10).reverse(),
      x: values.slice(0, 10).reverse(),
      text: labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barSettings = {
      title: "Top Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      xaxis: { title: "Number of Bacteria" }
    };

    Plotly.newPlot("bar", barChartData, barSettings);
  });
}

function initializeDashboard() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((jsonData) => {
    
    let idList = jsonData.names;

    let dropdown = d3.select("#selDataset");

    idList.forEach(id => {
      dropdown.append("option")
              .text(id)
              .property("value", id);
    });

    let initialID = idList[0];
    generateCharts(initialID);
    populateMetadata(initialID);
  });
}

function optionChanged(newID) {
  generateCharts(newID);
  populateMetadata(newID);
}

// Start everything
initializeDashboard();