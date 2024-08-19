import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const MyJobs = () => {

    const { user } = useAuthContext();

    const { userId } = useParams();

    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const BASE_URL = `http://localhost:7777/api/jobs/myJobs/${userId}`;

    useEffect(() => {
        setIsLoading(true);

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
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            setIsLoading(false);
        };

        fetchMyJobs();
    }, []);

    return (
        <div className="container max-w-screen-2xl mx-auto xl:px-24 px-4">
            <div className="my-jobs-container">
                <h1 className="text-center p-4">ALL My Jobs</h1>
                <div className="search-box p-2 text-center mb-2">
                    <input type="text" name="serach" id="" className="py-2 pl-3 border focus:outline-none lg-w-6/12 mb-4 w-full" />
                    <button className="bg-blue text-white font-semibold py-3 px-8 rounded-sm mb-4">
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MyJobs
