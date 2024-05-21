import './App.css';
import Axios from 'axios';
import { useState } from 'react';

function App() {
  const geniusApiKey = process.env.REACT_APP_GENIUS_API_KEY
  const geniusApiHost = process.env.REACT_APP_GENIUS_API_HOST
  const geniusApiDescriptionUrl = process.env.REACT_APP_GENIUS_API_DESCRIPTION_URL
  const geniusApiDetailsUrl = process.env.REACT_APP_GENIUS_API_DETAILS_URL
  const lyricsOvhApiUrl = process.env.REACT_APP_LYRICS_OVH_API_URL

  // États pour stocker les résultats, l'artiste, le titre et les paroles
  const [results, setResults] = useState([]);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [description, setDescription] = useState('');

  const optionsDetails = {
    method: 'GET',
    url: geniusApiDetailsUrl,
    params: {
      q: artist,
      per_page: '10',
      page: '1'
    },
    headers: {
      'X-RapidAPI-Key': geniusApiKey,
      'X-RapidAPI-Host': geniusApiHost
    }
  };

  const searchArtistDetails = () => {
    Axios.request(optionsDetails).then(res => {
      console.log('Details : ', res.data.hits);
      setResults(res.data.hits);
    }).catch(error => {
      console.log('Error fetching data:', error);
    });
  }

  const searchLyrics = () => {
    if (artist === "" || title === "") {
      return;
    }
    Axios.get(
      `${lyricsOvhApiUrl}${artist}/${title}`).then(res => {
        console.log(res.data.lyrics);
        setLyrics(res.data.lyrics);
      })
  }

  // Extraire l'ID de l'artiste principal du premier résultat
  const artistId = results.length > 0 ? results[0].result.primary_artist.id : null;
  
  const optionsDescription = {
    method: 'GET',
    url: geniusApiDescriptionUrl,
    params: {id: artistId},
    headers: {
      'X-RapidAPI-Key': geniusApiKey,
      'X-RapidAPI-Host': geniusApiHost
    }
  };

  const searchDescriptionArtist = () => {
    if (artistId === null) {
      return;
    }
    Axios.request(optionsDescription).then(res => {
      console.log('Description : ', res.data.artist.description_preview);
      setDescription(res.data.artist.description_preview)
    }).catch(error => {
      console.log('Error fetching data:', error);
    });
  };

  

  return (
    <div className="App">
      <input className="inp" type="text"
        placeholder='Artist name'
        onChange={(e) => { setArtist(e.target.value) }} />
      <input className="inp" type="text"
        placeholder='Title name'
        onChange={(e) => { setTitle(e.target.value) }} />
      <button className="btn"
        onClick={() => searchLyrics()}>
        Search Lyrics
      </button>
      <button className="btn"
        onClick={() => searchArtistDetails()}>
        Search Details
      </button>
      <button className="btn"
        onClick={() => searchDescriptionArtist()}>
        Search Description
      </button>
      <hr />
      <pre>{lyrics}</pre>
      {artistId && (
        <div>
          <h3>{description}</h3>
        </div>
      )}
      <ul>
        {results.map((song, index) => (
          <li key={index}>
            <h2>{song.result.full_title}</h2>
            <p>{song.result.artist_names}</p>
            <img src={song.result.header_image_thumbnail_url} alt={song.result.full_title} />
            <p>{song.result.release_date_for_display}</p>
            <a href={song.result.url} target="_blank" rel="noopener noreferrer">Lyrics</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;