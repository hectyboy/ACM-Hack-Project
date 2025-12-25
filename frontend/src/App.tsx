import { useState } from 'react'
import ProfilePage from './ProfilePage/ProfilePage'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [page, setPage] = useState("ProfilePage");
  const [username, setUsername] = useState("nathan");

  return (
    <>
      {
        page === "ProfilePage" ? (
          <ProfilePage username={username} />
        ) : null
      }
    </>
  )
}

export default App
