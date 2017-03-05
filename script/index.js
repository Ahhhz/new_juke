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
                      div.innerHTML = getCardMarkup(name, preview_url, id, album, imageUrl, false);;
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






          const SpotifyAPI = {};

          // @param urlBase {string}
          SpotifyAPI.urlBase = 'https://api.spotify.com';
          // @param version {number}
          SpotifyAPI.version = 1;

  SpotifyAPI.getUrlBase = () => {
      const {urlBase, version} = SpotifyAPI;
      return urlBase + '/v' + version + '/';
      //     https://api.spotify.com/v1/
  }; // getUrlBase

  /*
      @func getUrlString
      @returns {string}
  */

  SpotifyAPI.getUrlString = (endpoint) => {
      return SpotifyAPI.getUrlBase() + endpoint + '/?';
      // ^^^ https://api.spotify.com/v1search/?
  }; // getUrlString

  /*
      @func search
      @param {string} q
      @param {string} type
      @returns {Promise}
      @desc - takes a searchQuery and optional
      type arg, returns promise that makes
      call to Spotify API
  */
  SpotifyAPI.search = (q = reqParam(), type = 'track') => {
      // search?q=adele&type=track
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
  }; // SpotifyAPI.search








  const results = document.querySelector('.js-searchresult');
  let closeCtrl = document.querySelector('.search-close'),
       searchContainer = document.querySelector('.search'),
       inputSearch = document.querySelector('.search__input');

    function runEvents() {
      events();
    }

    function events() {
      inputSearch.addEventListener('focus', openSearch);
      inputSearch.addEventListener('keydown', (e) => {
        const {keyCode, which} = e;
        // ^^^^ equivalent to: const keyCode = e.keyCode
        //                     const which = e.which
        // this is called object destructuring #es6

        if (keyCode === 13 || which === 13) {
          console.log(e)
           runSearchQuery();
          //  e.preventDefault()
          }
         if (keyCode===13) {
          e.preventDefault()
        }
    });
      closeCtrl.addEventListener('click', closeSearch);
      document.addEventListener('keyup', function(e) {
        // escape key.
        if( e.keyCode == 27 ) {
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
