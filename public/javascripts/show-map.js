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
                `<strong>${property.title}<strong>
                <p class="mb-0 light-font">$${property.price}</p>`
            )
    ).addTo(map);