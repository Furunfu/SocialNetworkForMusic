var password = document.getElementById("password");
var  body = {};

document.getElementById('mostraNascondi').addEventListener('click', async function (event) {
    event.preventDefault();

    var mostraNascondi = document.getElementById("mostraNascondi");

    if (password.type === "password") {
        password.type = "text";
        mostraNascondi.textContent = "Nascondi";
    } else {
        password.type = "password";
        mostraNascondi.textContent = "Mostra";
    }
});

document.getElementById('delete').addEventListener('click', async function (event) {
    event.preventDefault();

    var conferma = confirm("Sei sicuro di voler eliminare l'account?");
    if (conferma) {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/register';
        } else {
            alert(data.message || 'Errore durante l\'eliminazione');
        }
    } else {
        alert("Eliminazione annullata");
    }
});

document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    var selected_genres = document.querySelectorAll("#cG :checked");
    var selected_genres_values = []
    for (i = 0; i < selected_genres.length; i++) {

        selected_genres_values.push(selected_genres[i].value)

    }
    var selected_artists = document.querySelectorAll("#cA :checked");
    var selected_artists_values = []
    for (i = 0; i < selected_artists.length; i++) {

        selected_artists_values.push(selected_artists[i].value)

    }

    try {
        var oldEmailRes = await fetch('/api/user/me');
        oldEmailRes = await oldEmailRes.json();
        oldEmail = oldEmailRes.email;
        body = {
            name: name,
            surname: surname,
            artists: selected_artists_values,
            genres: selected_genres_values
        };

        if(email !== oldEmail){
            body.email = email;
        }
        if(password){
            body.password = password;
        }
        
        jsonBody = JSON.stringify(body);

        const response = await fetch('/api/user/updateData', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        const data = await response.json();

        if (response.ok) {

            window.location.href = '/profile';
        } else {
            alert(data.message || 'Errore durante l\'aggiornamento dei dati');
        }
    } catch (error) {
        alert('Errore: ' + error.message);
    }
});
