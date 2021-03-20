const capRateE = document.querySelector('#capRate');

if (property.capRate50 < 2) {
    capRateE.classList.add('red-font');
} else if (property.capRate50 < 8) {
    capRateE.classList.add('yellow-font');
} else {
    capRateE.classList.add('green-font');
}