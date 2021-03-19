mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: property.geometry.coordinates,
    zoom: 8
});

new mapboxg1.Marker()
    .setLngLat(property.geometry.coordinates)
    .setPopup(
        new mapboxg1.Popup({offset: 25})
            .setHTML(
                `<h3>${property.title}</h3><p>$${property.price}</p>`
            )
    ).addTo(map);