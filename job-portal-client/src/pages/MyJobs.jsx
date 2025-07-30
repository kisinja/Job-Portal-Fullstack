import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiSearch, FiBriefcase, FiUserCheck } from "react-icons/fi";
import Loader from "../components/Loader";

const MyJobs = () => {
  const { user } = useAuthContext();
  const { userId } = useParams();

  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const partUrl = user?.role === "employer" ? "myJobs" : "applied";
  const BASE_URL = `${
    import.meta.env.VITE_BACKEND_URL
  }/jobs/${partUrl}/${userId}`;

  const fetchMyJobs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
        setError(data.message || data.error);
      }
    } catch (err) {
      setJobs([]);
      setError("Failed to fetch jobs.");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.ok) {
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert("Job deleted successfully");
      } else {
        alert("Failed to delete job");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      const filteredJobs = jobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchText.toLowerCase())
      );
      setJobs(filteredJobs);
    } else {
      fetchMyJobs();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container max-w-screen-2xl mx-auto xl:px-24 px-4 py-8 my-10">
      <div
        className={`p-6 rounded-xl shadow-sm ${
          user?.role === "employer" ? "bg-blue-50" : "bg-indigo-50"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {user?.role === "employer" ? (
                <>
                  <FiBriefcase className="text-blue-600" />
                  My Posted Jobs
                </>
              ) : (
                <>
                  <FiUserCheck className="text-indigo-600" />
                  My Applications
                </>
              )}
            </h1>
            <p className="text-gray-600">
              {user?.role === "employer"
                ? "Manage your job postings and applications"
                : "Track your job applications and status"}
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {Array.isArray(jobs) && jobs.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              {user?.role === "employer"
                ? "You haven't posted any jobs yet."
                : "You haven't applied to any jobs yet."}
            </p>
            {user?.role === "employer" && (
              <Link
                to="/post-job"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">
                {jobs.length} job{jobs.length === 1 ? "" : "s"} found
              </h2>
              <button
                onClick={fetchMyJobs}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead
                  className={`${
                    user?.role === "employer" ? "bg-blue-50" : "bg-indigo-50"
                  }`}
                >
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Salary
                    </th>
                    {user?.role === "job-seeker" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job, index) => (
                    <tr
                      key={job._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {job.jobTitle}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {job.jobLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {job.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {job.employmentType || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${job.minPrice}k - ${job.maxPrice}k
                      </td>
                      {user?.role === "job-seeker" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Applied
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                        {user?.role === "employer" && (
                          <>
                            <Link
                              to={`/edit-job/${job._id}`}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <CiEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {user?.role === "job-seeker" && (
                          <Link
                            to={`/job/${job._id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
