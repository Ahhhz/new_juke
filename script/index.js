(function(){


























  let closeCtrl = document.querySelector('.search-close'),
  		 searchContainer = document.querySelector('.search'),
  		 inputSearch = searchContainer.querySelector('.search__input');

  	function runEvents() {
  		events();
  	}

  	function events() {
  		inputSearch.addEventListener('focus', openSearch);
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
