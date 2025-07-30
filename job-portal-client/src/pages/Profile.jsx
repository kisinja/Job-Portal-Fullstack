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
  FiFileText,
  FiDownload,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const { userId } = useParams();
  const location = useLocation();
  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/profile`;
  const RESUME_URL = `${import.meta.env.VITE_BACKEND_URL}/resumes`;

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
  const [activeTab, setActiveTab] = useState("resume");
  const [success, setSuccess] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

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
    } else if (location.pathname.includes("resumes")) {
      setActiveTab("resumes");
    } else {
      setActiveTab("profile");
    }
  }, [BASE_URL, user.token, userId, location.pathname]);

  const fetchResume = async () => {
    setResumeLoading(true);
    try {
      const res = await fetch(`${RESUME_URL}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setResume(data);
      } else {
        setError(data.error || "Failed to fetch resume");
      }
    } catch (error) {
      console.log(error.message);
      setError("Failed to fetch resume");
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "resumes") {
      fetchResume();
    }
  }, [activeTab]);

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`${RESUME_URL}/${resume._id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to download resume PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${userProfile.username}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(error.message);
    }
  };

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

  const renderResumePreview = () => {
    if (resumeLoading) return <Loader />;
    if (!resume)
      return (
        <div className="text-center py-12">
          <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Resume Found</h3>
          <p className="mt-2 text-gray-500">
            Create your first resume to get started
          </p>
          <Link
            to="/create-resume"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Resume
          </Link>
        </div>
      );

    return (
      <div className="relative">
        {/* Floating Download Button */}
        <div className="fixed bottom-8 right-8 z-10">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <FiDownload className="text-lg" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Resume Preview - Mimics Paper */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">
          {/* Resume Header with Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                {resume.personalInfo?.profilePic ? (
                  <img
                    src={resume.personalInfo.profilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-4xl text-indigo-600" />
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">
                  {resume.personalInfo?.fullName || "Your Name"}
                </h1>
                <p className="text-indigo-100 text-lg mt-1">
                  {resume.personalInfo?.title || "Professional Title"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {resume.personalInfo?.email && (
                    <a
                      href={`mailto:${resume.personalInfo.email}`}
                      className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"
                    >
                      <FiMail /> {resume.personalInfo.email}
                    </a>
                  )}
                  {resume.personalInfo?.phone && (
                    <a
                      href={`tel:${resume.personalInfo.phone}`}
                      className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full"
                    >
                      <FiPhone /> {resume.personalInfo.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resume Content */}
          <div className="p-8">
            {/* Summary Section */}
            {resume.personalInfo?.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-indigo-700 mb-2 border-b-2 border-indigo-100 pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resume.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {resume.experience?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-indigo-500 before:border-4 before:border-indigo-100"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {exp.role} at {exp.company}
                        </h3>
                        <p className="text-indigo-600">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                      </div>
                      {exp.location && (
                        <p className="text-gray-500 text-sm">{exp.location}</p>
                      )}
                      <p className="mt-2 text-gray-700 whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resume.education?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                  Education
                </h2>
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div
                      key={index}
                      className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-indigo-500 before:border-4 before:border-indigo-100"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {edu.degree} in {edu.fieldOfStudy}
                        </h3>
                        <p className="text-indigo-600">
                          {new Date(edu.startDate).toLocaleDateString()} -{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                      </div>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-gray-500 text-sm">{edu.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two Column Layout for Skills, Projects, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills Section */}
              {resume.skills?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {resume.languages?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                    Languages
                  </h2>
                  <div className="space-y-2">
                    {resume.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{lang.name}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{
                              width: `${getProficiencyWidth(
                                lang.proficiency
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {resume.projects?.length > 0 && (
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                    Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resume.projects.map((proj, index) => (
                      <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-indigo-800">
                          {proj.title}
                        </h3>
                        <p className="mt-2 text-gray-700">{proj.description}</p>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-indigo-600 hover:underline"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {resume.certifications?.length > 0 && (
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                    Certifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resume.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-indigo-500 pl-4"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {cert.title}
                        </h3>
                        <p className="text-gray-600">
                          {cert.issuingOrganization}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Issued:{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                          {cert.expirationDate && (
                            <span>
                              {" "}
                              • Expires:{" "}
                              {new Date(
                                cert.expirationDate
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-1 text-indigo-600 hover:underline text-sm"
                          >
                            View Credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies Section */}
              {resume.hobbies?.length > 0 && (
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
                    Hobbies & Interests
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white border border-indigo-100 text-indigo-800 rounded-full shadow-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm">
            Resume generated by TechPoster • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    );
  };

  // Helper function for language proficiency visualization
  const getProficiencyWidth = (proficiency) => {
    switch (proficiency.toLowerCase()) {
      case "native":
        return 100;
      case "fluent":
        return 80;
      case "intermediate":
        return 60;
      case "basic":
        return 40;
      default:
        return 20;
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
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 py-4 px-6 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiUser className="text-lg" />
              Profile
            </button>
            {user?.role === "job-seeker" && (
              <>
                <button
                  onClick={() => setActiveTab("applied-jobs")}
                  className={`flex items-center gap-2 py-4 px-6 font-medium text-sm ${
                    activeTab === "applied-jobs"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiBriefcase className="text-lg" />
                  Applied Jobs
                </button>
                <button
                  onClick={() => setActiveTab("resumes")}
                  className={`flex items-center gap-2 py-4 px-6 font-medium text-sm ${
                    activeTab === "resumes"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiFileText className="text-lg" />
                  My Resumes
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <Loader />
          ) : activeTab === "profile" ? (
            <div className="max-w-7xl">
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
          ) : activeTab === "applied-jobs" ? (
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
          ) : activeTab === "resumes" ? (
            renderResumePreview()
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
