const fetchWithToken = require('../utils/fetchWrapper').fetchWithToken;
const { filterTrackFields, filterAlbumFields, filterArtistFields } = require('../utils/spotifyDataMapper');

async function getGlobalTopTracks() {
    const response = await fetchWithToken('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF?fields=tracks.items.track(id,name,artists(id,name,type),duration_ms,explicit,album.name,album.images)');

    const data = await response.json();

    // Controlla se ci sono tracce nella risposta
    if (!data.tracks || !data.tracks.items) {
        throw new Error('No tracks found in playlist');
    }

    // Rimuovi il livello extra "track" e applica il filtraggio
    const tracks = data.tracks.items.map(item => filterTrackFields(item.track));

    return tracks;
}

async function getGlobalTopArtists() {
    const tracks = await getGlobalTopTracks();

    // Estrai gli ID degli artisti da ogni traccia
    const artistIds = tracks.map(track => track.artists.map(artist => artist.id));

    // Unisci tutte le liste di ID degli artisti in una sola lista e rimuovi gli ID duplicati
    const uniqueArtistIds = [...new Set([].concat(...artistIds))];

    // Poiché l'endpoint di Spotify permette di recuperare al massimo 50 artisti per chiamata, 
    // potremmo aver bisogno di effettuare più chiamate se ci sono più di 50 artisti unici.
    const artistChunks = [];
    for (let i = 0; i < uniqueArtistIds.length; i += 50) {
        artistChunks.push(uniqueArtistIds.slice(i, i + 50));
    }

    // Recupera i dettagli degli artisti in blocchi
    let allArtistsDetails = [];
    for (let chunk of artistChunks) {
        const response = await fetchWithToken(`https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`);
        const data = await response.json();
        allArtistsDetails.push(...data.artists);
    }

    // Estrai le informazioni desiderate (nome, id, immagine) per ogni artista
    const artistsDetails = allArtistsDetails.map(filterArtistFields);

    // Ordina gli artisti per popolarità in ordine decrescente
    artistsDetails.sort((a, b) => b.popularity - a.popularity);

    return artistsDetails;
}

async function getNewReleases() {
    const url = `https://api.spotify.com/v1/browse/new-releases?limit=10`;
    const response = await fetchWithToken(url);
    const data = await response.json();

    // verifica che la risposta contenga effettivamente gli album
    if (!data.albums || !data.albums.items) {
        throw new Error('No new releases found on Spotify');
    }

    // Estrai solo i campi rilevanti
    return data.albums.items.map(filterAlbumFields);
}

module.exports = {
    getGlobalTopTracks: getGlobalTopTracks,
    getGlobalTopArtists: getGlobalTopArtists,
    getNewReleases: getNewReleases
};