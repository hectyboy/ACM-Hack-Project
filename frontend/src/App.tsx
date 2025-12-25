import { useState } from 'react'
import ProfilePage from './ProfilePage/ProfilePage'
import MoviePage from './MoviePage/MoviePage'
import {cars3Movie} from './MoviePage/Data'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [page, setPage] = useState("MoviePage");
  const [username, setUsername] = useState("nathan");

  return (
    <>
      {
        page === "ProfilePage" ? (
          <ProfilePage username={username} />
        ) : null
      }
      {
        page === "MoviePage" ? (
          <MoviePage movie={cars3Movie} />
        ) : null
      }
    </>
  )
}

export default App
