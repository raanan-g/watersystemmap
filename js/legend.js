

function createMapLegend(metric, description, paint, compare=false) {

  // Create a container for the legend
  const legendContainer = document.createElement('div');
  legendContainer.id = 'legend';

  // Create a title for the legend
  const legendTitle = document.createElement('p');
  legendTitle.classList.add('legend-title');
  legendTitle.textContent = metric;
  legendContainer.appendChild(legendTitle);

  // Create a hidden description for the legend
  const legendDescription = document.createElement('p');
  legendDescription.classList.add('legend-description');
  legendDescription.id = 'legend-desc';
  legendDescription.textContent = description;
  legendContainer.appendChild(legendDescription);

  // Create an info icon that toggles the description.
  const infoToggle = document.createElement('span');
  infoToggle.classList.add('toggle-description');
  infoToggle.textContent = 'More Info';
  infoToggle.addEventListener('click', () => {
    if (infoToggle.textContent === 'Hide Info') {
      document.getElementById('legend-desc').style.display = 'none';
      infoToggle.textContent = 'More Info';
    }
    else {
      document.getElementById('legend-desc').style.display = 'block';
      infoToggle.textContent = 'Hide Info';
    }

  });
  legendContainer.appendChild(infoToggle);

  // Create an info icon that toggles the description.
  const legendToggle = document.createElement('span');
  legendToggle.classList.add('toggle-legend');
  legendToggle.textContent = 'Minimize Legend';
  legendToggle.addEventListener('click', () => {
    if (legendToggle.textContent === 'Show Legend') {
      toggleLegendItems('block');
      legendToggle.textContent = 'Minimize Legend';
    }
    else {
      toggleLegendItems('none');
      legendToggle.textContent = 'Show Legend';
    }

  });
  legendContainer.appendChild(legendToggle);


  if (paint['fill-color'][0]==='interpolate'){
    choropleth(paint, legendContainer);
    var legendClass = 'legend-container';
    legendContainer.classList.add(legendClass);
  }
  if (paint['fill-color'][0]==='case'){
    categorical(paint, legendContainer);
    var legendClass = 'legend-container-categorical';
    legendContainer.classList.add(legendClass);
  }

  return legendContainer;
}

function choropleth(paint, legendContainer) {
  // Get the fill color ramp and stops from the paint object
  var fillColor = paint['fill-color'];
  var stops = fillColor.slice(3);
  var colors = stops.filter((color, index) => index % 2 !== 0)

  // Create a gradient bar for the legend
  const gradientBar = document.createElement('div');
  gradientBar.classList.add('gradient-bar');
  gradientBar.style.background = `linear-gradient(to right, ${colors.join(", ")})`;
  gradientBar.style.opacity = paint['fill-opacity'].slice(-1)[0];
  legendContainer.appendChild(gradientBar);

  const labelContainer = document.createElement('div');
  labelContainer.classList.add('legend-labels');
  // Create a div for each stop in the fill color ramp
  for (var i = 0; i < stops.length; i += 2) {
    var stop = stops[i];
    const stopLabel = document.createElement('div');
    //stopLabel.style.width = legendContainer.style.width / colors.length;
    stopLabel.classList.add('stop-label');
    stopLabel.textContent = stop.toLocaleString();
    labelContainer.appendChild(stopLabel);
    legendContainer.appendChild(labelContainer);
  }

}

function categorical(paint, legendContainer) {
  var fillColor = paint['fill-color'];
  var stops = fillColor.slice(1, fillColor.length - 1);
  var categories = stops.filter((_, i) => i % 2 === 0);
  var colors = stops.filter((_, i) => i % 2 !== 0);

  for (var i=0;i<categories.length;i++){

    var legendItem = document.createElement("div");
    legendItem.classList.add("legend-item");

    var color = colors[i];
    var colorDiv = document.createElement("div");
    colorDiv.classList.add("category-color");
    colorDiv.style.backgroundColor = color;

    var label = categories[i][2];
    var labelDiv = document.createElement("div");
    labelDiv.classList.add("category-label");
    labelDiv.textContent = label;

    legendItem.appendChild(colorDiv);
    legendItem.appendChild(labelDiv);
    legendContainer.appendChild(legendItem);
  }
}

function toggleLegendItems(display) {
    var legend = document.getElementById('legend');
    var children = legend.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child.classList.contains('legend-title') && !child.classList.contains('toggle-description') && !child.classList.contains('toggle-legend')) {
            if (display!="none") {
              child.style.display = child.classList.contains('legend-labels') ? 'flex':display;
            }
            else {
              child.style.display = display;
            }

        }
    }
}
