import { useState } from 'react';
import Loader from '../components/Loader';

const Salary = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');
    const [industry, setIndustry] = useState('');
    const [salary, setSalary] = useState(null);
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    /* const BASE_URL = 'http://localhost:7777/api/salary/estimate'; */
    const BASE_URL = 'https://techposter-backend.onrender.com/api/salary/estimate';

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setIsLoading(true);

        if (!jobTitle || !location || !experience || !industry) {
            setError('Please provide all fields');
            return;
        }

        // Example static salary calculation
        const baseSalary = 50000;
        let estimatedSalary = baseSalary;

        // Add logic for calculating salary based on user inputs
        if (experience === 'Entry') estimatedSalary *= 1;
        else if (experience === 'Mid') estimatedSalary *= 1.5;
        else if (experience === 'Senior') estimatedSalary *= 2;


        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobTitle, location, experience, industry })
            });
            const data = await res.json();
            if (res.ok) {
                setSalary(data.estimatedSalary);
                setError('');
                setIsLoading(false);
            } else {
                setError(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }

        setSalary(estimatedSalary);
        setError('');
        setIsLoading(false);
    };

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
                    <label className="block text-lg mb-2 font-medium">Experience Level</label>
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
                    className="w-full py-2 px-4 bg-blue text-white rounded font-semibold"
                >
                    {isLoading ? 'Calculating...' : 'Calculate Salary'}
                </button>
            </form>

            <div className="mt-5 text-center">
                <h2 className="text-xl font-semibold">
                    Estimated Salary:
                    <span className="text-blue font-light ml-2">
                        {salary ? `$${salary.toLocaleString()}` : '$0'}
                    </span>
                </h2>
            </div>

            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Salary;
