import { useState, useEffect } from "react";
import Card from "../components/Card";
import Banner from "../components/Banner";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";
import NewsLetter from "../components/NewsLetter";
import { useAuthContext } from "../hooks/useAuthContext";
import Loader from "../components/Loader";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 6;

  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/jobs`;
  const { user } = useAuthContext();

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(BASE_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setJobs(data);
        } else {
          console.error(data.error || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchJobs();
    }
  }, [user]);

  const handleInputChange = (e) => setQuery(e.target.value);
  const handleChange = (e) => setSelectedCategory(e.target.value);
  const handleClick = (e) => setSelectedCategory(e.target.value);

  const filteredItems = jobs.filter((job) =>
    job.jobTitle?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredData = (jobsList, selected, searchQuery) => {
    let filtered = jobsList;

    if (searchQuery) {
      filtered = filteredItems;
    }

    if (selected) {
      filtered = filtered.filter((job) => {
        const {
          jobLocation,
          maxPrice,
          salaryType,
          employmentType,
          createdAt,
          experienceLevel,
        } = job;

        return (
          (jobLocation &&
            jobLocation.toLowerCase() === selected.toLowerCase()) ||
          (maxPrice && parseInt(maxPrice) <= parseInt(selected)) ||
          (createdAt && createdAt >= selected) ||
          (salaryType && salaryType.toLowerCase() === selected.toLowerCase()) ||
          (employmentType &&
            employmentType.toLowerCase() === selected.toLowerCase()) ||
          (experienceLevel &&
            experienceLevel.toLowerCase() === selected.toLowerCase())
        );
      });
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered
      .slice(start, end)
      .map((job, index) => <Card key={index} data={job} />);
  };

  const nextPage = () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const result = filteredData(jobs, selectedCategory, query);

  return (
    <div>
      <Banner handleInputChange={handleInputChange} query={query} />

      <div className="bg-[#fafafa] md:grid grid-cols-4 gap-8 lg:px-[60px] px-4 py-12">
        {/* Left - Sidebar */}
        <div className="bg-white p-4 rounded">
          <Sidebar handleChange={handleChange} handleClick={handleClick} />
        </div>

        {/* Middle - Job Cards */}
        <div className="col-span-2 bg-white p-2 rounded-sm">
          {loading ? (
            <Loader />
          ) : result.length > 0 ? (
            <Jobs result={result} />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">0 Jobs</h3>
              <p>No jobs found</p>
            </>
          )}

          {/* Pagination */}
          {result.length > 0 && (
            <div className="flex justify-center mt-4 space-x-8">
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="hover:underline text-primary/70"
              >
                Previous
              </button>
              <span className="text-primary">
                Page {currentPage} of{" "}
                {Math.ceil(filteredItems.length / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredItems.length / itemsPerPage)
                }
                className="hover:underline text-primary/70"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right - Newsletter */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-bold text-2xl text-primary mb-3">Newsletter</h3>
          <NewsLetter />
        </div>
      </div>
    </div>
  );
};

export default Home;
