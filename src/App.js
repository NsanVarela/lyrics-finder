import './App.css';
import Axios from 'axios';
import { useState } from 'react';

function App() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");

  function searchLyrics() {
    if (artist === "" || title === "") {
      return;
    }
    Axios.get(
      `https://private-anon-6aaab12ad2-lyricsovh.apiary-proxy.com/v1/${artist}/${title}`).then(res => {
        console.log(res.data.lyrics);
        setLyrics(res.data.lyrics);
      })
  }

  return (
    <div className="App">
      <h1>Lyrics Finder ???</h1>

      <input className="inp" type="text"
        placeholder='Artist name'
        onChange={(e) => { setArtist(e.target.value) }} />
      <input className="inp" type="text"
        placeholder='Title name'
        onChange={(e) => { setTitle(e.target.value) }} />
      <button className="btn"
        onClick={() => searchLyrics()}>
        ??? Search
      </button>
      <hr />
  <pre>{lyrics}</pre>
    </div>
  );
}

export default App;
