export let currentSearchType = 'track';  // valore di default

// Aggiungi un event listener a tutti i bottoni della navbar
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function () {
        currentSearchType = this.getAttribute('data-type');
    });
});
