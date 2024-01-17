import { currentSearchType } from './globalVariables.js';

document.getElementById('searchInput').addEventListener('input', function () {
    const stuff = document.getElementById('addStuff');
    const query = searchInput.value;
    const type = currentSearchType;

    // Codifica la query per utilizzarla nell'URL
    const encodedQuery = encodeURIComponent(query);
    if (!query) {
        return;
    }

    fetch(`/api/search/${type}?query=${encodedQuery}`)
        .then(res => res.json())
        .then(data => {
            if (type === 'track') {

                // Costruisco l'HTML delle schede con le informazioni degli album
                let cardHtml = "";
                data.forEach((track, index) => {
                    cardHtml += `
        <div class="col">
            <div class="card h-100">
                <img src="${track.image}" class="card-img-top w-100" alt="...">
                <div class="card-body">
                    <h4>
                        ${track.name}
                    </h4>
                    <p>
                        ${track.artists[0].name}
                    </p>
                </div>
                <div class="card-footer">
                <button type="button" class="btn btn-primary like-btn-song"
                data-bs-toggle="modal" data-bs-target="#myModal"
                data-track-id="${track.id}">Add</button>
                </div>
            </div>
        </div>
    `;

                    // Se la lunghezza del dato è multipla di 5, aggiungo delle schede vuote per completare la griglia
                    if (index % 5 === 4 && data.length % 5 !== 0) {
                        let emptyCards = 5 - data.length % 5;
                        for (let i = 0; i < emptyCards; i++) {
                            cardHtml += `
                <div class="col"></div>
            `;
                        }
                    }
                });

                // Inserisco le schede all'interno dell'elemento "stuff"
                stuff.innerHTML = `
    <div class="container p-4">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            ${cardHtml}
        </div>
    </div>
`;
            } else if (type === 'album') {
                // Costruisco l'HTML delle schede con le informazioni degli album
                let cardHtml = "";
                data.forEach((album, index) => {
                    cardHtml += `
                       <div class="col">
                           <div class="card h-100">
                               <img src="${album.image}" class="card-img-top w-100" alt="...">
                               <div class="card-body">
                                   <h4>
                                       ${album.name}
                                   </h4>
                                   <p>
                                       ${album.type}
                                   </p>
                               </div>
                            </div>   
                       </div>
                   `;

                    // Se la lunghezza del dato è multipla di 5, aggiungo delle schede vuote per completare la griglia
                    if (index % 5 === 4 && data.length % 5 !== 0) {
                        let emptyCards = 5 - data.length % 5;
                        for (let i = 0; i < emptyCards; i++) {
                            cardHtml += `
                               <div class="col"></div>
                           `;
                        }
                    }
                });

                // Inserisco le schede all'interno dell'elemento "stuff"
                stuff.innerHTML = `
                   <div class="container p-4">
                       <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                           ${cardHtml}
                       </div>
                   </div>
               `;

            } else if (type === 'artist') {
                // Costruisco l'HTML delle schede con le informazioni degli album
                let cardHtml = "";
                data.forEach((artist, index) => {
                    cardHtml += `
        <div class="col">
            <div class="card h-100">
            <img src="${artist.image}" class="card-img-top w-100" alt="...">
                <div class="card-body">
                    <h4>
                        ${artist.name}
                    </h4>
                    <p>
                        Artist
                    </p>
                </div>
            </div>
        </div>
    `;

                    // Se la lunghezza del dato è multipla di 5, aggiungo delle schede vuote per completare la griglia
                    if (index % 5 === 4 && data.length % 5 !== 0) {
                        let emptyCards = 5 - data.length % 5;
                        for (let i = 0; i < emptyCards; i++) {
                            cardHtml += `
                <div class="col"></div>
            `;
                        }
                    }
                });

                // Inserisco le schede all'interno dell'elemento "stuff"
                stuff.innerHTML = `
    <div class="container p-4">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            ${cardHtml}
        </div>
    </div>
`;
            } else if (type === 'playlist') {
                // Costruisco l'HTML delle schede con le informazioni degli album
                let cardHtml = "";
                data.forEach((playlist, index) => {
                    cardHtml += `
        <div class="col">
            <div class="card h-100" onclick="location.href='/playlist/${playlist._id}'">
                <div class="card-body">
                    <h4>
                        ${playlist.title}
                    </h4>
                    <p>
                        Playlist
                    </p>
                </div>
            </div>
        </div>
    `;

                    // Se la lunghezza del dato è multipla di 5, aggiungo delle schede vuote per completare la griglia
                    if (index % 5 === 4 && data.length % 5 !== 0) {
                        let emptyCards = 5 - data.length % 5;
                        for (let i = 0; i < emptyCards; i++) {
                            cardHtml += `
                <div class="col"></div>
            `;
                        }
                    }
                });

                // Inserisco le schede all'interno dell'elemento "stuff"
                stuff.innerHTML = `
    <div class="container p-4">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            ${cardHtml}
        </div>
    </div>
`;
            } else if (type === 'user') {
                // Costruisco l'HTML delle schede con le informazioni degli album
                let cardHtml = "";
                data.forEach((user, index) => {
                    cardHtml += `
        <div class="col">
            <div class="card h-100" onclick="location.href='/users/${user._id}'">
                <div class="card-body">
                    <h4>
                        ${user.name} ${user.surname}
                    </h4>
                    <p>
                        User
                    </p>
                </div>
            </div>
        </div>
    `;

                    // Se la lunghezza del dato è multipla di 5, aggiungo delle schede vuote per completare la griglia
                    if (index % 5 === 4 && data.length % 5 !== 0) {
                        let emptyCards = 5 - data.length % 5;
                        for (let i = 0; i < emptyCards; i++) {
                            cardHtml += `
                <div class="col"></div>
            `;
                        }
                    }
                });

                // Inserisco le schede all'interno dell'elemento "stuff"
                stuff.innerHTML = `
    <div class="container p-4">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            ${cardHtml}
        </div>
    </div>
`;
            }
        });
});
