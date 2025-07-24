import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Books from './pages/Books'
import Create from './pages/Create'
import Update from './pages/Update'
import User from './pages/User'
import Signup from './pages/Signup'
import Login from './pages/Login'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Books/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/update/:id" element={<Update/>} />
        <Route path="/user" element={<User/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
