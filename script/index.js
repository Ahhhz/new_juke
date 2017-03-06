(function(){

  function reqParam() {
      throw new Error('This is a required param!');
  }



      const runSearchQuery = () => {
              const {value} = inputSearch;

              validateSearch(value)
                  .then((query) => {
                      console.log('about to search for: ', query);

                      inputSearch.value = '';
                      inputSearch.setAttribute('disabled', 'disabled');



                      return SpotifyAPI.search(query);
                  })
                  .then((data) => {
                      // bring back the input fields
                      inputSearch.removeAttribute('disabled');

                      // clear search results
                      results.innerHTML = "";
                      // append new results
                      const tracks = data.tracks.items;
                      for(const track of tracks) {
                          addTrackToHTML(track);
                      }

                  })
                  .catch((e) => {
                      alert(e);
                  });
          }


          const validateSearch = (value) => {
            return new Promise((resolve, reject) => {
            if (value.trim() === "") {
              reject('Input a value');
              }
                resolve(value);
              });
         };


  const getCardMarkup = (name, preview_url, id, album, imageUrl, isDimmed) => {
           let html = `
                <div class="image">
                   <img src="${imageUrl}">
                      </div>
                    <div class="content">
                      <a class="header">${name}</a>
                        <div class="meta">${album.name}</div>
                          <div class="description">
                             <audio controls class="${id}" style="width: 100%;">
                               <source src="${preview_url}">
                                  </audio>
                              </div>
                          </div>
                      `;
                      if (isDimmed) {
                          html += `<div class="ui dimmer transition visible active" style="display: block !important;"></div>`;
                      }

                      return html;
                  }











              const addTrackToHTML = (track) => {
                      const {name, preview_url, id, album} = track;
                      const imageUrl = album.images[1].url;

                      // ^^^^ simpler version of the below set of lines
                      // const name = track.name
                      // const preview_url = track.preview_url
                      // const id = track.id
                      // const album = track.album

                      // add the generate HTML contents to the search results div
                      const div = document.createElement('div');
                      div.classList.add('ui', 'card', 'dimmable');
                      div.innerHTML = getCardMarkup(name, preview_url, id, album, imageUrl, false);
                      results.appendChild(div);

                      div.addEventListener('click',() => {
                          PlaylistManager.addTrack(track);
                          const currentIndex = PlaylistManager.tracks.length - 1;
                          // console.log(currentIndex);

                          const playlistTrack = document.createElement('div');
                          playlistTrack.classList.add('ui', 'card', 'trackid-' + id);
                          playlistTrack.innerHTML = `
              <div class="item playlist-track trackid-${id}">
                  <a href="#" class="playlist-close js-playlist-close">
                      <i class="icon remove"></i>
                  </a>
                  <div class="ui tiny image">
                    <img src="${imageUrl}">
                  </div>
                  <div class="middle aligned content playlist-content">
                    ${name}
                  </div>
              </div>
              <audio controls style="width: 100%;">
            <source src="${preview_url}">
        </audio>
            `
            playlist.appendChild(playlistTrack)

            // get the AUDIO tag
            const audio = playlistTrack.querySelector('audio');

            audio.addEventListener('play', () => {
                PlaylistManager.currentSong = currentIndex;
            });

            audio.addEventListener('ended', () => {
                console.log('done!')
                const nextTrackId = PlaylistManager.getNextSong();

                setTimeout(() => {
                    document.querySelector(`.trackid-${nextTrackId} audio`).play();
                }, 1000);

            })
            const closeBtn = playlistTrack.querySelector('.js-playlist-close');
           closeBtn.addEventListener('click', () => {
                if (PlaylistManager.currentSong === currentIndex) {
                    const nextTrackId = PlaylistManager.getNextSong();

                    setTimeout(() => {
                        document.querySelector(`.trackid-${nextTrackId} audio`).play();
                    }, 500);
                }
                PlaylistManager.removeById(id);

                playlist.removeChild(playlistTrack);
           })
        })
        // console.log(html)
    }


  //   const PlaylistManager = {};
   //
  //   // this array will store the trackIds for all the
  //   // chosen songs by user
  //   PlaylistManager.tracks = [];
   //
  //   // this number will refer to the CURRENT song
  //   // since our tracks variable is an array, current song
  //   // is really just an index of that array
  //   PlaylistManager.currentSong = 0;
   //
  //   /*
  //       @func addTrack
  //       @param {string} track
   //
  //       @desc - takes a trackId and
  //       adds it to the end of the array
  //       @example - here's how you would use this code:
  //                  PlaylistManager.addTrack('trackId');
  //   */
  //   PlaylistManager.addTrack = (track = reqParam()) => {
  //       PlaylistManager.tracks.push(track);
  //   }; // PlaylistManager.addTrack
   //
   //
  //   PlaylistManager.removeById = (id) => {
  //       for (let i = 0; i < PlaylistManager.tracks.length; i++) {
  //           const track = PlaylistManager.tracks[i];
  //           if (track.id === id) {
  //               PlaylistManager.tracks.splice(i, 1);
   //
  //               break;
  //           }
  //       }
  //   }
   //
   //
  //   PlaylistManager.getNextSong = () => {
  //       PlaylistManager.currentSong++;
  //       const {tracks, currentSong} = PlaylistManager;
  //       const len = tracks.length;
  //  if (currentSong === len) {
  //  PlaylistManager.currentSong = 0;
  //  }
   //
  //  return tracks[PlaylistManager.currentSong].id;
  //  }
   //
   //
   //
   //
   //






   const SpotifyAPI = {}
    SpotifyAPI.urlBase = 'https://api.spotify.com';
    SpotifyAPI.version = 1;

  SpotifyAPI.getUrlBase = () => {
      const {urlBase, version} = SpotifyAPI;
      return urlBase + '/v' + version + '/';

  };

  SpotifyAPI.getUrlString = (endpoint) => {
      return SpotifyAPI.getUrlBase() + endpoint + '/?';

  };

  SpotifyAPI.search = (q = reqParam(), type = 'track') => {
      return new Promise((resolve, reject) => {
          const url = SpotifyAPI.getUrlString('search') + 'q=' + q + '&type=' + type;

          const http = new XMLHttpRequest();
          http.open('GET', url);

          http.onload = () => {
              const data = JSON.parse(http.responseText);
              resolve(data);
          };

          http.send();
      });
  };







       const results = document.querySelector('.js-searchresult');
       const closeCtrl = document.querySelector('.search-close'),
       searchContainer = document.querySelector('.search'),
       inputSearch = document.querySelector('.search__input');
       const playlist = document.querySelector('.js-playlist');


    function runEvents() {
      events();
    }

    function events() {
      inputSearch.addEventListener('focus', openSearch);
      inputSearch.addEventListener('keydown', (e) => {
        const {keyCode, which} = e;
        if (keyCode === 13 || which === 13) {
           runSearchQuery();
           closeSearch();
          }
    });
      closeCtrl.addEventListener('click', closeSearch);
      document.addEventListener('keyup', (e)=> {
        const {keyCode, which} = e;
        if(keyCode == 27||which === 27 ) {
          closeSearch();
        }
      });
    }

    function openSearch() {
      searchContainer.classList.add('search--open');
      inputSearch.focus();

    }

    function closeSearch() {
      searchContainer.classList.remove('search--open');
      inputSearch.blur();
      inputSearch.value = '';
    }

    runEvents();







})();
