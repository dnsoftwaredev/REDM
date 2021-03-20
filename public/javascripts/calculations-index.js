const sortedPP = document.querySelector('#sortedPP');
const sortedRev = document.querySelector('#sortedRev');
const sortRev = document.querySelector('#sortRev');
const sortPP = document.querySelector('#sortPP');

sortRev.addEventListener('click', function () {
    sortedPP.classList.add('is-hidden');
    sortedRev.classList.remove('is-hidden');
})

sortPP.addEventListener('click', function () {

    sortedRev.classList.add('is-hidden');
    sortedPP.classList.remove('is-hidden');
})