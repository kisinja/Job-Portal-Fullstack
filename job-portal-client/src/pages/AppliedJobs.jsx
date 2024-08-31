import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Loader from '../components/Loader';

const AppliedJobs = () => {
    const { userId } = useParams();
    const { user } = useAuthContext();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await fetch(`http://localhost:7777/api/jobs/applied/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                // Check if response is not JSON and handle it
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    // Handle cases where response is not valid JSON
                    console.error(`Failed to parse JSON: ${err.message}`, text);
                    setError('Failed to load applied jobs. Please try again later.');
                    setLoading(false);
                    return;
                }

                if (res.ok) {
                    setAppliedJobs(data.jobs);
                    setLoading(false);
                } else {
                    setError(data.error || 'Failed to load applied jobs');
                    setLoading(false);
                }

                setError(null);
            } catch (error) {
                console.log(error.message);
                setError('Failed to load applied jobs');
                setLoading(false);
            }
        };


        fetchAppliedJobs();
    }, [userId, user.token, user._id]);

    return (
        <div className="max-w-screen-2xl container xl:px-24 p-4 py-4 mx-auto">

            <h1 className="font-light text-3xl text-center mb-4">My applied jobs</h1>

            {loading && <Loader />}
            {error && <div className='error'>{error}</div>}
            {!loading && appliedJobs.length > 0 && (
                <ul>
                    {appliedJobs.map(job => (
                        <li key={job._id} className="mb-4 p-4 border border-gray-200 rounded-lg flex justify-between">
                            <div className='flex flex-col gap-2'>
                                <h3 className="text-lg font-light text-blue">{job.jobTitle}</h3>
                                <p className="text-gray-700">{job.companyName}</p>
                                <p className="text-primary/70">
                                    <strong>Salary:</strong>
                                    ${job.minPrice} - ${job.maxPrice}k ({job.salaryType})
                                </p>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <p className="mt-2 text-primary/70 flex gap-1 items-center">
                                    <strong>Employment Type:</strong>
                                    {job.employmentType}
                                </p>
                                {job.experienceLevel && <p className="text-primary/70 flex gap-1 items-center">
                                    <strong>Experience Level:</strong>
                                    {job.experienceLevel}
                                </p>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {!loading && appliedJobs.length === 0 && <p>No applied jobs found.</p>}
        </div>
    );
};

export default AppliedJobs;
