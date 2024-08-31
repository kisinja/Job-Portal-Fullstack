import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Loader from "../components/Loader";

const JobDetails = () => {

    const { id } = useParams();

    const { user } = useAuthContext();

    const [job, setJob] = useState({});
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [message, setMessage] = useState(null);
    const BASE_URL = `https://techposter-backend.onrender.com/api/jobs/${id}`;

    const handleApply = async () => {
        setLoading(true);

        console.log(user._id, job._id);

        let applicationDetails = { userId: user._id, jobId: job._id };

        const res = await fetch(`https://techposter-backend.onrender.com/api/jobs/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(applicationDetails)
        });

        if (res.ok) {
            const data = await res.json();
            setMessage(data.message);
            setLoading(false);
        }

        if (!res.ok) {
            const data = await res.json();
            setErr(data.error);
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        const fetchJob = async () => {
            try {
                const res = await fetch(BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                const data = await res.json();

                console.log(data);

                if (res.ok) {
                    console.log(data);
                    setJob(data);
                    setLoading(false);
                }

                if (!res.ok) {
                    console.log(data);
                    setLoading(false);
                    setErr(data.error);
                }

                setErr(null);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setErr(error.message);
            }
        };

        fetchJob();
    }, [user.token, BASE_URL]);

    const formatDate = (date) => {
        return date.split("T")[0];
    }

    return (
        <div className="bg-white min-h-screen p-8">

            <h1 className="font-light text-3xl text-center mb-4">Job Details</h1>

            <div className="bg-gray-200 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <img src={job.companyLogo} alt={job.companyName} className="h-16 w-16 mr-4" />
                    <div>
                        <h2 className="text-2xl font-semibold">{job.companyName}</h2>
                        <p className="text-blue">{job.jobTitle}</p>
                        <p className="text-gray-600">{job.createdAt && formatDate(job.createdAt)}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Job Description</h3>
                    <p className="mt-2 text-primary/70">{job.description}</p>
                </div>

                {job.postedBy && <div className="mt-2">
                    <h3 className="text-xl font-semibold">Posted By</h3>
                    <p className="mt-2 text-gray-800">{job.postedBy.email}</p>
                </div>}

                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Skills Required</h3>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {job.skills && job.skills.map((skill) => (
                            <span key={skill._id} className='bg-orange-50 p-1 rounded border border-blue'>{skill.value}</span>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Details</h3>
                    <p className="mt-2 text-primary/70">
                        <strong>Employment Type:</strong>
                        {job.employmentType}
                    </p>
                    {job.experienceLevel && <p className="text-primary/70">
                        <strong>Experience Level:</strong>
                        {job.experienceLevel}
                    </p>}
                    <p className="text-primary/70">
                        <strong>Salary:</strong>
                        ${job.minPrice} - ${job.maxPrice}k ({job.salaryType})
                    </p>
                </div>

                {loading && <Loader />}
                {err && <div className="error">{err}</div>}
                {message && <div className="message">{message}</div>}

                <div className="mt-6">
                    <button
                        onClick={handleApply}
                        className="bg-blue hover:bg-blue text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? "Loading..." : "Apply Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JobDetails
