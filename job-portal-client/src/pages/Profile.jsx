import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import CreatableSelect from "react-select/creatable";
import Loader from "../components/Loader";
import {
  FiEdit,
  FiSave,
  FiUser,
  FiBriefcase,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const { userId } = useParams();
  const location = useLocation();
  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/profile`;

  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    bio: "",
    role: "",
    profilePic: "",
    userSkills: [],
    experience: 0,
    education: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/${userId}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUserProfile(data.user);
          setLoading(false);
        } else {
          setError(data.error);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getProfile();

    // Set active tab based on URL
    if (location.pathname.includes("applied-jobs")) {
      setActiveTab("applied-jobs");
    } else {
      setActiveTab("profile");
    }
  }, [BASE_URL, user.token, userId, location.pathname]);

  const handleChange = (e) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setUserProfile({
      ...userProfile,
      profilePic: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("username", userProfile.username);
    formData.append("email", userProfile.email);
    formData.append("bio", userProfile.bio);
    formData.append("userSkills", JSON.stringify(userProfile.userSkills));
    formData.append("experience", userProfile.experience);
    formData.append("education", userProfile.education);

    if (password) {
      formData.append("password", password);
    }

    if (userProfile.profilePic instanceof File) {
      formData.append("profilePic", userProfile.profilePic);
    }

    try {
      const res = await fetch(`${BASE_URL}/update/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An error occurred");
        setTimeout(() => {
          setError("");
        }, 3000);
      } else {
        // Update user profile in context
        dispatch({ type: "UPDATE_USER", payload: data });

        setSuccess("Profile updated successfully");
        setTimeout(() => {
          setSuccess("");
        }, 3000);
        setError("");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleSkillChange = (skills) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      userSkills: skills.map((skill) => skill.value),
    }));
  };

  const skillOptions = userProfile.userSkills.map((skill) => ({
    value: skill,
    label: skill,
  }));

  const getHeaderText = (userRole) => {
    switch (userRole) {
      case "job-seeker":
        return "Job Seeker";
      case "employer":
        return "Employer";
      case "admin":
        return "Admin Profile";
      default:
        return "User Profile";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
                src={user.profilePic}
                alt="Profile"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <FiEdit className="text-blue-600" />
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {userProfile.username}
              </h1>
              <p className="text-blue-100">{getHeaderText(userProfile.role)}</p>
              <div className="mt-2 flex gap-2 justify-center md:justify-start">
                {userProfile.experience > 0 && (
                  <span className="bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                    {userProfile.experience} years experience
                  </span>
                )}
                {userProfile.education && (
                  <span className="bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                    {userProfile.education}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <Link
              to={`/profile/${userId}`}
              className={`flex items-center gap-2 py-4 px-6 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiUser className="text-lg" />
              Profile
            </Link>
            {user?.role === "candidate" && (
              <Link
                to={`/jobs/applied/${userId}`}
                className={`flex items-center gap-2 py-4 px-6 font-medium text-sm ${
                  activeTab === "applied-jobs"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiBriefcase className="text-lg" />
                Applied Jobs
              </Link>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <Loader />
          ) : activeTab === "profile" ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPassword("");
                      setConfirmPassword("");
                      setError("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={userProfile.username}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {userProfile.username}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {userProfile.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {getHeaderText(userProfile.role)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={userProfile.experience}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {userProfile.experience} years
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="education"
                      value={userProfile.education}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {userProfile.education || "Not specified"}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userProfile.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-line">
                      {userProfile.bio || "No bio provided"}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  {isEditing ? (
                    <CreatableSelect
                      isMulti
                      value={skillOptions}
                      onChange={handleSkillChange}
                      placeholder="Add or select skills..."
                      className="w-full"
                      classNamePrefix="react-select"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                      {userProfile.userSkills.length > 0 ? (
                        userProfile.userSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills added</span>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="Leave blank to keep current"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {success && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                    {success}
                  </div>
                )}

                {isEditing && (
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiSave /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Applied Jobs
              </h3>
              <p className="mt-2 text-gray-500">
                Your applied jobs will appear here
              </p>
              <Link
                to="/jobs"
                className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
