import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Footer from "./components/Footer";
import MyJobs from "./pages/MyJobs";
import Salary from "./pages/Salary";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import './App.css';
import { useAuthContext } from "./hooks/useAuthContext";
import Profile from "./pages/Profile";

const App = () => {

  const { user } = useAuthContext();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" exact element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
        <Route path="/my-jobs" element={user ? <MyJobs /> : <Navigate to="/login" />} />
        <Route path="/salary" element={user ? <Salary /> : <Navigate to="/login" />} />
        <Route path="/post-job" element={user ? <PostJob /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App