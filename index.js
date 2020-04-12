const autoCompleteConfig = {
  renderOption(movie) {
    const posterSRC = movie.Poster ===  'N/A' ? '' : movie.Poster;
    return `
      <img src="${posterSRC}"/>
      ${movie.Title} (${movie.Year})
    `;
  },
  
  inputValue(movie) {
    return movie.Title;
  },

  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: "65fdeedd",
          s: searchTerm,
          type: 'movie',
        }
    });

    if (response.data.Error) {
      return [];
    } else {
      return response.data.Search;
    }   
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: "65fdeedd",
      i: movie.imdbID,
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if(side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftHandSideStats = document.querySelectorAll('#left-summary .notification' );
  const rightHandSideStats = document.querySelectorAll('#right-summary .notification' );

  leftHandSideStats.forEach((leftStat, index) => {
    rightStat = rightHandSideStats[index];
    const loser = +(leftStat.getAttribute("data-value")) < +(rightStat.getAttribute("data-value")) ? leftStat : rightStat;
    loser.classList.remove('is-primary');
    loser.classList.add('is-warning');
  });

}

const movieTemplate = (movieDetails) => {
  //what if any of these have no value!!!
  const numawardsarray = (movieDetails.Awards.match(/\d+/g)).map(Number);
  const numawards = numawardsarray.reduce((accumulator, currentValue) => accumulator + currentValue);
  const boxofficevalue = Number(movieDetails.BoxOffice.replace(/[^0-9\.]+/g, ""));
  const metascore = Number(movieDetails.Metascore);
  const rating = Number(movieDetails.imdbRating);
  const votes = Number(movieDetails.imdbVotes.replace(/,/g, ""));

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}"/>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${numawards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxofficevalue} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${rating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${votes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}