import { addSongToPlaylists } from './utils/addSongToPlaylist.js';

let currentTrackId = null;

const likeButtonSongs = document.querySelectorAll('.like-btn-song');
likeButtonSongs.forEach(button => {
    button.addEventListener('click', function (event) {
        currentTrackId = event.currentTarget.getAttribute('data-track-id');
    })
});

const doneButton = document.querySelector('#donePlaylistBtn');
doneButton.addEventListener('click', function () {
    addSongToPlaylists(currentTrackId);
});
