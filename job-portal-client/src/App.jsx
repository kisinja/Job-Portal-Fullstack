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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import EditJob from "./pages/EditJob";
import JobDetails from "./pages/JobDetails";

const App = () => {

  const { user } = useAuthContext();

  return (
    <div>
      <Navbar />
      <div className="px-[2%] md:px-0">
        <Routes>
          <Route path="/" exact element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
          <Route path="/my-jobs/:userId" element={user ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/edit-job/:id" element={user ? <EditJob /> : <Navigate to="/login" />} />
          <Route path="/job/:id" element={user ? <JobDetails /> : <Navigate to="/login" />} />
          <Route path="/salary" element={user ? <Salary /> : <Navigate to="/login" />} />
          <Route path="/post-job" element={user ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App