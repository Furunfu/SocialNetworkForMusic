import { addSongToPlaylists } from './utils/addSongToPlaylist.js';
    
let currentTrackId = null;
var likeButtonSongs = '';

var callback = function() {
likeButtonSongs = document.querySelectorAll('.like-btn-song');


likeButtonSongs.forEach(button => {
    button.addEventListener('click', function (event) {
        currentTrackId = event.currentTarget.getAttribute('data-track-id');
    })
});

} 

const selectedPlaylist = document.querySelectorAll('.playlist__sel');
selectedPlaylist.forEach(button => {
button.addEventListener('click', function () {
    const playlistId = this.getAttribute('data-playlist-id');
    addSongToPlaylists(currentTrackId, playlistId);
});
});

setInterval(callback, 500);