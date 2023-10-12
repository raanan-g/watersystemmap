// MODEL_LAYER_PATH = "https://services6.arcgis.com/hR19wnqEg78ptZn4/arcgis/rest/services/preliminary_nationwide_lsl_survey_with_predictions/FeatureServer/0/";

const PWS_LAYER_PATH = "https://services6.arcgis.com/hR19wnqEg78ptZn4/arcgis/rest/services/water_service_area_boundaries_with_ej_indicators/FeatureServer/0/";

//const PWS_LAYER_PATH = "https://services6.arcgis.com/hR19wnqEg78ptZn4/arcgis/rest/services/leadout_public_water_systems_dataset_20230303/FeatureServer/0/";

function getWaterSystemData(map, bbox) {

  let bound = (typeof bbox === "object") ? bbox.toString():bbox;

  EsriQueryLayerUpdate("water-systems", PWS_LAYER_PATH, {
    "geometry": bound.replace(",","%2C"),
    "outgeometryType":"esriGeometryEnvelope",
    "inSR":"4326",
    "spatialRel":"esriSpatialRelIntersects",
    "outSR":"4326"
  });
}

function EsriQueryLayerUpdate(sourceId, api_path, payload){

  var QUERY_PATH = `${api_path}query?where=1=1&outFields=*&${
    buildQueryString(payload)
  }&f=geojson`;

  Loading(true);
  fetch(QUERY_PATH)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      map.getSource(sourceId).setData(data);
      Loading(false);
    })
}

function buildQueryString(queryParams) {
  let queryString = "";
  Object.keys(queryParams).forEach((key, i) => {
    queryString += key + "=" + queryParams[key] + "&";
  });
  return queryString.slice(0, -1);
}

function Loading(state) {
  document.getElementById("loading").style.display = state ? "block":"none";
}
