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
                const res = await fetch(`https://techposter-backend.onrender.com/api/jobs/applied/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setAppliedJobs(data.jobs);
                    setLoading(false);
                } else {
                    setError(data.error);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
                setError('Failed to load applied jobs');
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, [userId, user.token]);

    return (
        <div className="max-w-screen-lg container xl:px-24 p-4 py-4">
            {loading && <Loader />}
            {error && <div className='error'>{error}</div>}
            {!loading && appliedJobs.length > 0 && (
                <ul>
                    {appliedJobs.map(job => (
                        <li key={job._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-bold">{job.title}</h3>
                            <p className="text-gray-700">{job.companyName}</p>
                        </li>
                    ))}
                </ul>
            )}
            {!loading && appliedJobs.length === 0 && <p>No applied jobs found.</p>}
        </div>
    );
};

export default AppliedJobs;
