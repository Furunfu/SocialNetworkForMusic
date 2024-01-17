const fetchWithToken = require('../utils/fetchWrapper').fetchWithToken;
const { filterArtistFields, filterAlbumFields, filterTrackFields } = require('../utils/spotifyDataMapper');

async function searchOnSpotify(query, type) {
  const formattedQuery = query.split(' ').join('+');

  const url = `https://api.spotify.com/v1/search?q=${formattedQuery}&type=${type}&limit=10`;

  const response = await fetchWithToken(url);

  const data = await response.json();

  switch (type) {
    case 'artist':
      return data.artists.items.map(filterArtistFields);
    case 'album':
      return data.albums.items.map(filterAlbumFields);
    case 'track':
      return data.tracks.items.map(filterTrackFields);
    default:
      throw new Error(`Unsupported search type: ${type}`);
  }
}


async function verifyTrackId(trackId) {
  try {
    const response = await fetchWithToken(`https://api.spotify.com/v1/tracks/${trackId}`);

    if (response.status !== 200) {
      return false;
    }

    const data = await response.json();
    
    return data && data.id === trackId;

  } catch (error) {
    console.error("Errore durante la verifica dell'ID della traccia su Spotify:", error);
    return false;
  }
}

async function getTracksFromSpotify(trackIds) {
  if (!Array.isArray(trackIds)) {
    throw new Error("L'input deve essere un array di ID delle tracce.");
  }

  if (trackIds.length === 0) {
    return [];
  }

  const idsParam = trackIds.join(',');

  const url = `https://api.spotify.com/v1/tracks?ids=${idsParam}`;

  const response = await fetchWithToken(url);

  if (!response.ok) {
    throw new Error("Errore nel recupero dei dettagli delle tracce da Spotify.");
  }

  const data = await response.json();

  return data.tracks.map(filterTrackFields);
}

async function getArtistsFromSpotify(artistIds) {
  if (!Array.isArray(artistIds) || artistIds.length === 0) {
    throw new Error("L'input deve essere un array non vuoto di ID di artisti.");
  }

  const idsParam = artistIds.join(',');

  const url = `https://api.spotify.com/v1/artists?ids=${idsParam}`;

  const response = await fetchWithToken(url);

  if (!response.ok) {
    throw new Error("Errore nel recupero dei dettagli degli artisti da Spotify.");
  }

  const data = await response.json();

  return data.artists.map(filterArtistFields);
}

module.exports = {
  searchOnSpotify: searchOnSpotify,
  verifyTrackId: verifyTrackId,
  getArtistsFromSpotify: getArtistsFromSpotify,
  getTracksFromSpotify: getTracksFromSpotify
};
