import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Loader from "../components/Loader";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [message, setMessage] = useState(null);
  const [suggestedCourses, setSuggestedCourses] = useState([]);

  const JOB_DETAILS_URL = `${import.meta.env.VITE_BACKEND_URL}/jobs/${id}`;
  const APPLY_URL = `${import.meta.env.VITE_BACKEND_URL}/jobs/apply/${id}`;

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleApply = async () => {
    setLoading(true);
    setErr(null);
    setMessage(null);
    setSuggestedCourses([]);

    try {
      const response = await fetch(APPLY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        if (Array.isArray(data.suggestions)) {
          // suggestions is an array of { course, courseLink }
          setSuggestedCourses(data.suggestions);
        } else {
          setErr(
            data.message || data.error || "You do not qualify for this job."
          );
        }
      }
    } catch (error) {
      console.log(error.message);
      setErr("Failed to apply for the job.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setErr(null);

      try {
        const response = await fetch(JOB_DETAILS_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setJob(data);
        } else {
          setErr(data.error || "Job not found.");
        }
      } catch (error) {
        console.error(error.message);
        setErr("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchJob();
    }
  }, [user?.token, JOB_DETAILS_URL]);

  if (loading && !job) return <Loader />;
  if (err && !job)
    return <div className="text-center text-red-600 mt-10">{err}</div>;

  console.log(job);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-12 overflow-hidden">
      {/* Header with decorative elements */}
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-100 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>

        {/* Main job card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
          {/* Job header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 ">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className=" p-1 rounded-lg shadow-md mr-6 flex-shrink-0">
                  <img
                    src={job?.companyLogo || "/default-logo.png"}
                    alt={job?.companyName || "Company Logo"}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    {job?.companyName}
                  </h2>
                  <p className="text-blue-100 text-lg">{job?.jobTitle}</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-medium">
                  Posted: {job?.createdAt && formatDate(job.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Job content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Job Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {job?.description}
                  </p>
                </div>

                {job?.postedBy && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                      <svg
                        className="w-6 h-6 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Posted By
                    </h3>
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          {job?.postedBy?.email}
                        </p>
                        <p className="text-gray-600 text-sm">Recruiter</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job?.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 shadow-sm"
                      >
                        {skill.value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Job Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Employment Type</span>
                      <span className="font-medium text-gray-800">
                        {job?.employmentType}
                      </span>
                    </div>
                    {job?.experienceLevel && (
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Experience Level</span>
                        <span className="font-medium text-gray-800">
                          {job?.experienceLevel}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Salary Range</span>
                      <span className="font-medium text-gray-800">
                        ${job?.minPrice}k - ${job?.maxPrice}k
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Type</span>
                      <span className="font-medium text-gray-800">
                        {job?.salaryType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages and suggestions */}
            <div className="mt-8 space-y-6">
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {message}
                </div>
              )}

              {err && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 text-red-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {err}
                </div>
              )}

              {suggestedCourses.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Suggested Courses to Improve Your Skills
                  </h3>
                  <ul className="space-y-3">
                    {suggestedCourses.map(({ course, courseLink }, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <div>
                          <a
                            href={courseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {course}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Apply button */}
            <div className="mt-10 text-center">
              <button
                onClick={handleApply}
                disabled={loading}
                className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group shadow-lg hover:shadow-xl"
              >
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-purple-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 bg-gradient-to-r from-blue-600 to-purple-700 rounded opacity-30 group-hover:opacity-0"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded-full shadow-md bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100"></span>
                <span className="relative flex items-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Apply Now
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
