mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: property.geometry.coordinates,
    zoom: 8
});

new mapboxgl.Marker()
    .setLngLat(property.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h4>${property.title}</h4><p>$${property.price}</p>`
            )
    ).addTo(map);