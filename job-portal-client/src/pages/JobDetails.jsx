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
    const [suggestedCourses, setSuggestedCourses] = useState([]);
    const BASE_URL = `https://techposter-backend.onrender.com/api/jobs/${id}`;

    // Qualification check function
    const checkUserQualification = (user, job) => {
        const missingSkills = job.skills.filter(skill => !user.userSkills.includes(skill));
        const experienceRequirementMet = user.experience >= job.requiredExperience;
        const educationRequirementMet = user.education === job.requiredEducation;

        if (missingSkills.length === 0 && experienceRequirementMet && educationRequirementMet) {
            return { qualifies: true };
        } else {
            return {
                qualifies: false,
                missingSkills,
                experienceRequirementMet,
                educationRequirementMet,
            };
        }
    };

    // Fetch suggested courses based on missing skills
    const fetchSuggestedCourses = async (missingSkills) => {
        const searchQuery = missingSkills.join(',');
        const udemyApiUrl = `http://localhost:7777/api/courses/suggest-courses?search=${encodeURIComponent(searchQuery)}`;

        try {
            const res = await fetch(udemyApiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            console.log(data)
            setSuggestedCourses(data.results);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    // Handle Apply function
    const handleApply = async () => {
        setLoading(true);

        // Check if the user qualifies for the job
        const qualificationResult = checkUserQualification(user, job);

        if (qualificationResult.qualifies) {
            // If the user qualifies, send the application
            const applicationDetails = { userId: user._id, jobId: job._id };

            try {
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
                    console.log(data);
                    setMessage(data.message);
                } else {
                    const data = await res.json();
                    console.log(data);
                    setErr(data.error);
                }
            } catch (error) {
                console.log(error.message);
                setErr('Failed to apply for the job');
            }
        } else {
            // If the user doesn't qualify, fetch suggested courses
            setMessage("You don't qualify for this job. Here are some courses to improve your skills:");
            fetchSuggestedCourses(qualificationResult.missingSkills);
        }

        setLoading(false);
    };

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);

            try {
                const res = await fetch(BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setJob(data);
                } else {
                    setErr(data.error);
                }
            } catch (error) {
                console.log(error.message);
                setErr('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [user.token, BASE_URL]);

    const formatDate = (date) => date.split("T")[0];

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
                        <strong>Employment Type:</strong> {job.employmentType}
                    </p>
                    {job.experienceLevel && <p className="text-primary/70">
                        <strong>Experience Level:</strong> {job.experienceLevel}
                    </p>}
                    <p className="text-primary/70">
                        <strong>Salary:</strong> ${job.minPrice} - ${job.maxPrice}k ({job.salaryType})
                    </p>
                </div>

                {loading && <Loader />}
                {err && <div className="error">{err}</div>}
                {message && <div className="message">{message}</div>}

                {suggestedCourses.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold">Suggested Courses</h3>
                        <ul>
                            {suggestedCourses.map((course) => (
                                <li key={course.id} className="mt-2">
                                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                                        {course.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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

export default JobDetails;