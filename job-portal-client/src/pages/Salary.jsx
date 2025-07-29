import { useState } from "react";

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
      setError("Please provide all fields");
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
        setError(data.error || "Failed to estimate salary.");
      }
    } catch (error) {
      console.error(error.message);
      setError("Server error while estimating salary.");
    }

    setIsLoading(false);
  };

  if (isLoading) return <div className="text-gray-500 flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-light mb-4">Salary Estimate Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg mb-2 font-medium">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2 font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2 font-medium">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Experience Level</option>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div>
          <label className="block text-lg mb-2 font-medium">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded font-semibold"
        >
          {isLoading ? "Calculating..." : "Calculate Salary"}
        </button>
      </form>

      {salaryRange && (
        <div className="mt-5 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Estimated Salary Range:
          </h2>
          <p className="text-blue text-lg font-light">
            ${salaryRange.min.toLocaleString()} – $
            {salaryRange.max.toLocaleString()}
          </p>
          {comment && (
            <p className="text-sm mt-2 text-gray-600 italic">{comment}</p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Salary;