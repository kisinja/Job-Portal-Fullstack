import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Loader from '../components/Loader';

const MyJobs = () => {

    const { user } = useAuthContext();

    const { userId } = useParams();

    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState("");

    /* const BASE_URL = `http://localhost:7777/api/jobs/myJobs/${userId}`; */

    const BASE_URL = `https://techposter-backend.onrender.com/api/jobs/myJobs/${userId}`;

    const fetchMyJobs = async () => {
        const res = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            setIsLoading(false);
            setJobs(data);
            console.log(data);
        }

        if (!res.ok) {
            setError(data.error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        setError("");

        fetchMyJobs();
    }, []);


    const handleDelete = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:7777/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (res.ok) {
                const newJobs = jobs.filter(job => job._id !== jobId);
                setJobs(newJobs);
                alert('Job deleted successfully');
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }
    };

    const handleClick = () => {

        setIsLoading(true);

        if (searchText.trim()) {
            const filteredJobs = jobs.filter(job =>
                job.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchText.toLowerCase())
            );

            setJobs(filteredJobs);
            setIsLoading(false);
        } else {
            fetchMyJobs();
        }
    };

    return (
        <div className="container max-w-screen-2xl mx-auto xl:px-24 px-4">
            <div className="my-jobs-container">
                <h1 className="text-center p-4 font-bold text-lg">All My Jobs</h1>
                <div className="search-box p-2 text-center mb-2 relative">
                    <input
                        type="text"
                        name="serach"
                        id=""
                        className="py-3 pl-3 border focus:outline-none lg-w-6/12 mb-4 w-full"
                        placeholder="Looking for a job... "
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="border-l text-gray-500 font-semibold py-3.5 px-3 rounded-sm mb-4 w-fit absolute top-2 right-2 hover:bg-blue hover:text-white" onClick={handleClick}>
                        <FiSearch className="text-xl font-bold cursor-pointer" onClick={handleClick} />
                    </div>
                </div>
            </div>

            {isLoading && <Loader />}

            {error && <div className="error">{error}</div>}

            {!isLoading && (
                <div className="jobs-list">
                    <h1 className="font-bold mb-2">
                        {jobs.length} job{jobs.length === 1 ? "" : "s"} found
                    </h1>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Employment Type
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Salary Type
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Max Price
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs && jobs.map((job, index) => (
                                    <tr key={job._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {job.jobTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.companyName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.employmentType ? job.employmentType : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.salaryType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${job.minPrice}k
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                            <button className="font-semibold py-2 px-4 rounded-sm shadow-sm">
                                                <CiEdit className="text-lg text-blue" />
                                            </button>
                                            <button className="py-2 px-4 rounded-sm shadow-sm" onClick={() => handleDelete(job._id)}>
                                                <MdDelete className="text-lg text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    )
}

export default MyJobs
