import { Routes,Route } from "react-router"
import Home from "./pages/home.jsx"
import Signup from "./pages/signup.jsx"
import Login from "./pages/login.jsx"

export default function App() {

  return (
      <>
      <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
      </Routes>
      </>
  )
}
