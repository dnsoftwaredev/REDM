(function () {
    'use strict'
    const requiredValidations = document.querySelectorAll('.need-validated')
    Array.from(requiredValidations)
        .forEach(function (requiredValidation) {
            requiredValidation.addEventListener('submit', function (event) {
                if (!requiredValidation.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                requiredValidation.classList.add('was-validated')
            }, false)
        })
})()
