import React, { useState, useRef, useEffect } from 'react';
import './MovieApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieApp = () => {
  const inputRef = useRef();
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // Toggle between Movies & Favorites

  const submitHandler = async (movie) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=22f92e2`);
      const value = await response.json();
      if (value.Search) {
        setMovies(value.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    submitHandler("Captain America");
  }, []);

  // Check if a movie is in favorites
  const isFavorite = (movieId) => favorites.some((fav) => fav.imdbID === movieId);

  // Add to favorites & hide button
  const addToFavorites = (movie) => {
    if (!isFavorite(movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  // Remove from favorites & show button
  const removeFromFavorites = (movieId) => {
    setFavorites(favorites.filter((movie) => movie.imdbID !== movieId));
  };

  return (
    <div className='MovieApp-container'>
      <div className='MovieApp'>
        <p>MOVIES APP</p>
        <div className='Movie-search'>
          <input ref={inputRef} type="text" placeholder="Search movies..." />
          <button type='button' onClick={() => submitHandler(inputRef.current.value)}>
            Search
          </button>
        </div>
      </div>

      <div className='Movie-icons'>
        <button type='button' onClick={() => setShowFavorites(false)}>Movies</button>
        <button type='button' onClick={() => setShowFavorites(true)}>Favorites</button>
      </div>

      {/* Movies/Favorites Grid */}
      <div className="container mt-4">
        <div className="row">
          {showFavorites
            ? favorites.length > 0
              ? favorites.map((movie) => (
                  <div key={movie.imdbID} className="col-md-4 mb-4">
                    <div className="card p-3 movie-card">
                      <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
                      <div className="card-body text-center">
                        <h4 className='card-title'>{movie.Title}</h4>
                        <button
                          type='button'
                          className='btn btn-danger'
                          onClick={() => removeFromFavorites(movie.imdbID)}
                        >
                          Remove from Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : <p className="text-center mt-3">No favorites added yet</p>
            : movies.length > 0
            ? movies.map((movie) => (
                <div key={movie.imdbID} className="col-md-4 mb-4">
                  <div className="card p-3 movie-card">
                    <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
                    <div className="card-body text-center">
                      <h4 className='card-title'>{movie.Title}</h4>
                      {!isFavorite(movie.imdbID) && (
                        <button
                          type='button'
                          className='btn btn-primary'
                          onClick={() => addToFavorites(movie)}
                        >
                          Add to Favorites
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            : <p className="text-center mt-3">No movies found</p>}
        </div>
      </div>
    </div>
  );
};

export default MovieApp;
