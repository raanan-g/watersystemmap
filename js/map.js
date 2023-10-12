
mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZWNvbmR1aXQiLCJhIjoiY2t0eWdqcnM0MzNidTJvcm94NnE0Y3M2biJ9.v74bmczLSr2Eb8iw8h3B3w';
const map = new mapboxgl.Map({
    container: 'mapbox',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/blueconduit/cl4ymcdgy000414pd5v1ggem5',
    center: [-93.121, 39.199],
    zoom: 3.4,
    //interactive: false
});
