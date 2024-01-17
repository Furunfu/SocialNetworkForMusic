const checkBox = document.getElementById("view");

checkBox.addEventListener("change", function() {

var endpoint = "";

if (checkBox.checked) {
    endpoint = `/api/playlists/${playlistId}/publish`;
} else {
    endpoint = `/api/playlists/${playlistId}/unpublish`;
}

fetch(endpoint, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        if (response.status === 200) {
            alert("Stato della playlist aggiornato con successo!", 'success');
        } else {
            alert("Si è verificato un errore durante l'aggiornamento dello stato della playlist.", 'error');
        }
    })
    .catch(error => console.error('Si è verificato un errore:', error));
});

document.querySelector('#saveChange').addEventListener('click', () => {
    const newTitle = document.querySelector('#title').value;
    const newDesc = document.querySelector('#description').value.trim();
    const newTagsString = document.querySelector('#tags').value;
    const newTagsArray = newTagsString.split(' ').filter(tag => tag.length > 0);
   
    // playlistId viene preso da playlist.ejs
    fetch(`/api/playlists/${playlistId}/title`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
    })
        .then(response => {
            if (response.status === 200) {
                // Trova il nodo di testo all'interno dell'elemento <h1> e aggiorna il suo valore
                alert("Titolo della playlist aggiornato con successo!", 'success');

            } else {
                alert("Si è verificato un errore durante l'aggiornamento del titolo della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));

        fetch(`/api/playlists/${playlistId}/description`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: newDesc })
        })
            .then(response => {
                if (response.status === 200) {
                    // Se la nuova descrizione è vuota, mostra "No Description", altrimenti mostra la descrizione inserita
                    const descriptionText = newDesc === '' ? 'No Description' : newDesc;
    
                    alert("Descrizione della playlist aggiornata con successo!", 'success');
                } else {
                    alert("Si è verificato un errore durante l'aggiornamento della descrizione della playlist.", 'error');
                }
            })
            .catch(error => console.error('Si è verificato un errore:', error));

                // Verifica che ogni tag inizi con '#' e abbia almeno tre lettere
    if (newTagsArray.length !== 0) {
        for (const tag of newTagsArray) {
            if (!tag.startsWith('#') || tag.length < 4) {
                alert("Ogni tag deve iniziare con il simbolo '#', avere almeno tre lettere ed essere separato da uno spazio.");
                return;
            }
        }
    }


    fetch(`/api/playlists/${playlistId}/tags`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: newTagsArray })
    })
        .then(response => {
            if (response.status === 200) {
                alert("Tags aggiornati con successo!", 'success');
                window.location.href=window.location.href;
            } else {
                alert("Si è verificato un errore durante l'aggiornamento dei tags della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));

    });

document.getElementById('deleteButton').addEventListener('click', () => {
    // Chiedi conferma all'utente prima di procedere con l'eliminazione
    if (!confirm('Sei sicuro di voler eliminare questa playlist? ')) {
        return; // Esci dalla funzione se l'utente annulla
    }
    // Effettua la richiesta DELETE all'endpoint appropriato
    fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.status === 200) {
                alert("Playlist eliminata con successo!", 'error');
                // Utilizza setTimeout per ritardare il reindirizzamento di 2 secondi
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                throw new Error('Si è verificato un errore durante l\'eliminazione della playlist.');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});
