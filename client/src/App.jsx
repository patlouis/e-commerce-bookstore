import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Books from './pages/Books'
import Create from './pages/Create'
import Update from './pages/Update'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import UserProfile from './pages/UserProfile'

// admin pages
import ManageBooks from './pages/admin/ManageBooks'
import ManageCategories from './pages/admin/ManageCategories'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Books/>} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/create" element={<Create/>} />
        <Route path="/books/update/:id" element={<Update/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/user" element={<UserProfile/>} />
        <Route path="/manage/books" element={<ManageBooks />} />
        <Route path="/manage/categories" element={<ManageCategories />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
