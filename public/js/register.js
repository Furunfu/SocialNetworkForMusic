document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

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
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                artists: selected_artists_values,
                genres: selected_genres_values
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Se la registrazione ha avuto successo, il token sarà salvato come cookie.

            // Reindirizza l'utente alla pagina home
            window.location.href = '/home';
        } else {
            alert(data.message || 'Errore durante la registrazione');
        }
    } catch (error) {
        alert('Errore: ' + error.message);
    }
});
