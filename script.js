// script.js

// API Key for OMDB API
const API_KEY = '8f908699';

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favMovie = document.getElementById('favMovie');
favMovie.style.display = 'none'; // Hide favorites section initially
const favoriteNav = document.getElementById('favoriteNav');
let moviesSection = document.getElementById('moviesSection');
const movieDetails = document.getElementById('movieDetails');
movieDetails.style.display = 'none'; // Hide movie details section initially

// Event listener for clicking on favorites navigation
favoriteNav.addEventListener('click', () => {
    movieDetails.style.display = 'none'; // Hide movie details if displayed
    favMovie.style.display = 'block'; // Display favorites section
    moviesSection.style.display = 'none'; // Hide movies section
});

// Event listener for clicking on home navigation
const homeNav = document.getElementById('homeNav');
homeNav.addEventListener('click', () => {
    movieDetails.style.display = 'none'; // Hide movie details if displayed
    favMovie.style.display = 'none'; // Hide favorites section
    moviesSection.style.display = 'block'; // Display movies section
});

// Array to store favorite movies
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Debounce function for search input
searchInput.addEventListener('input', debounce(searchMovies, 300));

function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Function to search movies
async function searchMovies() {
    const searchTerm = searchInput.value;
    if (searchTerm.length < 3) {
        searchResults.innerHTML = '';
        return;
    }

    // Fetch movies data from OMDB API
    const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=8f908699&s=${searchTerm}&plot=full`);
    const data = await response.json();

    if (data.Search) {
        searchResults.innerHTML = '';
        data.Search.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <button class="favorite" data-imdbid="${movie.imdbID}">Add to Favorites</button>
            `;
            searchResults.appendChild(movieDiv);

            // Event listener for adding movie to favorites
            movieDiv.addEventListener('click', () => {
                showMovieDetails(movie);   
            });
        });

        const favoriteButtons = document.querySelectorAll('.favorite');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', addToFavorites);
        });
    }
}

// Function to add a movie to favorites
function addToFavorites(event) {
    event.stopPropagation(); // Prevent event bubbling
    const imdbID = event.target.dataset.imdbid;
    const movie = favorites.find(favorite => favorite.imdbID === imdbID);
    if (!movie) {
        const movieData = {
            imdbID,
            Title: event.target.previousElementSibling.textContent,
            Poster: event.target.previousElementSibling.previousElementSibling.src
        };
        favorites.push(movieData);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Movie added to favorites!');
    } else {
        alert('Movie already in favorites!');
    }
}

// Event listener for clicking on favorites navigation
favoriteNav.addEventListener('click', showFavoritesPage);

// Function to display the home page
function showHomePage() {
    contentDiv.innerHTML = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

// Function to display the favorites page
function showFavoritesPage() {
    favResults.innerHTML = '';
    const favoritesList = document.createElement('ul');
    favoritesList.classList.add('favoritesUl');
    favorites.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <button class="removeFavorite" data-imdbid="${movie.imdbID}">Remove from Favorites</button>
        `;
        favoritesList.appendChild(listItem);

        // Event listener for clicking on a favorite movie
        listItem.addEventListener('click', () => {
            showMovieDetails(movie);   
        });
    });
    favResults.appendChild(favoritesList);

    const removeButtons = document.querySelectorAll('.removeFavorite');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromFavorites);
    });
}

// Function to remove a movie from favorites
function removeFromFavorites(event) {
    event.stopPropagation(); // Prevent event bubbling
    const imdbID = event.target.dataset.imdbid;
    const movieIndex = favorites.findIndex(movie => movie.imdbID === imdbID);
    if (movieIndex !== -1) {
        favorites.splice(movieIndex, 1); // Remove the movie from the favorites array
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Movie removed from favorites!');
        showFavoritesPage(); // Refresh the favorites page
    } else {
        alert('Movie not found in favorites!');
    }
}

// Function to display movie details
async function showMovieDetails(movie) {
    moviesSection.style.display = 'none';
    favMovie.style.display = 'none';
    const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=8f908699&t=${movie.Title}&plot=full`);
    const movie2 = await response.json();

    if (movie2) {
        movieDetails.style.display = 'block';   
        let moviePoster = document.getElementById('poster');
        moviePoster.src = movie2.Poster;
        let movieTitle = document.getElementById('title');
        movieTitle.textContent = "Title: " +movie2.Title;
        let moviePlot = document.getElementById('plot');
        moviePlot.textContent = "Plot: " + movie2.Plot;
        let movieRating = document.getElementById('rating');
        movieRating.textContent = "IMDB Rating: " + movie2.imdbRating;
        let movieYear = document.getElementById('year');
        movieYear.textContent = "Year: " +movie2.Year;
        let movieGenre = document.getElementById('genre');
        movieGenre.textContent = "Genre: " +movie2.Genre;
    } else {
        // Handle case where movie details are not found
        contentDiv.innerHTML = '<p>Movie details not found.</p>';
    }
}
