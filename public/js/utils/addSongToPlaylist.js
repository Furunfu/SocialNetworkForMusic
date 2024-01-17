function addSongToPlaylists(currentTrackId, playlistId) {

    let url, reqBody;
    url = `/api/playlists/${playlistId}/tracks`;
    reqBody = {
        trackId: currentTrackId
    };


 fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to add track to playlist with ID ${playlistId}`);
        }
        return response.json();
    })
    .then(() => {
        // Dato che tutte le chiamate hanno restituito un codice di stato 200, possiamo mostrare l'alert di successo
        alert('Brano aggiunto alle playlist con successo!', 'success');
    })
    .catch(error => {
        console.error('Si è verificato un errore:', error);
        alert('Si è verificato un errore durante l\'aggiunta del brano.', 'error');
    });
}
export { addSongToPlaylists };
