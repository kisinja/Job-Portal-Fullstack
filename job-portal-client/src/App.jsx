import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Footer from "./components/Footer";
import MyJobs from "./pages/MyJobs";
import Salary from "./pages/Salary";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import './App.css';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App