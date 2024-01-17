const recToken = require('../utils/fetchWrapper').recToken;

async function getGenres() {

    const token = await recToken();
    const result = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {

        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return await result.json();
}
async function getArtists() {

    const token = await recToken();
    const result = await fetch('https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6%2C2R4kNOwHUUsuDYhKsESVbF%2C1Xyo4u8uXC1ZmMpatF05PJ%2C0Y5tJX1MQlPlqiwlOH1tJY%2C1uNFoZAHBGtllmzznpCI3s%2C3TVXtAsR1Inumwj472S9r4%2C6eUKZXaKkcviH0Ku9w2n3V%2C06HL4z0CvFAxyc27GXpf02%2C6KImCVD70vtIoJWnq6nGn3%2C66CXWjxzNUsdJxJ2JdwvnR%2C6HhnhnxLsowYuuejvku0Bz%2C1ZwdS5xdxEREPySFridCfh%2C75f5Och3JFaYplIDkeM0J6%2C1Ij5ZIGlPTkoZibay58zHe%2C1LZEQNv7sE11VDY3SdxQeN%2C4KWTAlx2RvbpseOGMEmROg%2C0KlSW3j5fUEfej47FOrBMr%2C5L7YW37rmblBi7hp6MD8v1%2C40NnTNMDZIn8iIVooum3nE%2C3dRfiJ2650SZu6GbydcHNb%2C23TFHmajVfBtlRx5MXqgoz%2C2K5nCggbhSZ00YCYP5qkZS%2C0jdNdfi4vAuVi7a6cPDFBM%2C5SulO4l40qDuV9zUGLZx7n', {

        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return await result.json();

}

module.exports = { getGenres, getArtists};