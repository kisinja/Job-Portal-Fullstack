import { useState } from "react";
import { FiSearch, FiDollarSign, FiMapPin, FiBriefcase, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Salary = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [salaryRange, setSalaryRange] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/salary/estimate`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSalaryRange(null);
    setComment("");
    setIsLoading(true);

    if (!jobTitle || !location || !experience || !industry) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          location,
          experienceLevel: experience,
          industry,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSalaryRange(data.estimatedSalary);
        setComment(data.estimatedSalary.comment || "");
      } else {
        setError(data.error || "Failed to estimate salary. Please try again.");
      }
    } catch (error) {
      console.error(error.message);
      setError("Network error. Please check your connection.");
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Analyzing market data...</h2>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center my-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Salary Estimate Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Get accurate salary estimates based on current market data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiBriefcase className="mr-2 text-blue-500" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiAward className="mr-2 text-blue-500" />
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select your level</option>
                  <option value="Entry">Entry Level (0-2 years)</option>
                  <option value="Mid">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior Level (6+ years)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiBriefcase className="mr-2 text-blue-500" />
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g. Technology, Healthcare"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                disabled={isLoading}
              >
                <FiSearch className="mr-2" />
                {isLoading ? "Calculating..." : "Estimate Salary"}
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {salaryRange && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 bg-blue-50 rounded-xl p-6"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <FiDollarSign className="text-blue-500 text-2xl mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Estimated Salary Range</h2>
                  </div>
                  
                  <div className="flex justify-center items-baseline mb-4">
                    <span className="text-4xl font-bold text-blue-600">
                      ${salaryRange.min.toLocaleString()}
                    </span>
                    <span className="text-2xl text-gray-500 mx-2">-</span>
                    <span className="text-4xl font-bold text-blue-600">
                      ${salaryRange.max.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 ml-1">/year</span>
                  </div>

                  {comment && (
                    <div className="max-w-md mx-auto">
                      <p className="text-gray-600 italic border-t border-gray-200 pt-4">
                        "{comment}"
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Market Range
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {Math.round(salaryRange.percentile || 50)}th Percentile
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${salaryRange.percentile || 50}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Data is based on real-time market analysis and industry benchmarks</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Salary;