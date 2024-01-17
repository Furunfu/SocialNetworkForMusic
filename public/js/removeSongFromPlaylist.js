const remove = document.querySelectorAll('.remove');
remove.forEach(song => {
    song.addEventListener('click', function (event) {
        event.preventDefault();

        const trackId = this.getAttribute('data-track-id');

        const url = `/api/playlists/${playlistId}/tracks/${trackId}`;

        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    alert("Traccia rimossa con successo!", 'neutral');
                } else {
                    console.error('Errore nella rimozione della traccia:', response.statusText);
                }
            })
            .catch(error => {
                // Gestisci eventuali errori di rete qui
                console.error('Errore:', error);
            });
    });
});



