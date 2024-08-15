import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Banner from '../components/Banner';
import Jobs from './Jobs';
import Sidebar from '../sidebar/Sidebar';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setLoading(true);
        fetch("jobs.json").then(res => res.json()).then(data => {
            console.log(data);
            setJobs(data);
            setLoading(false);
        });
    }, []);

    const [query, setQuery] = useState("");
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // filter jobs by title
    const filteredItems = jobs.filter(job => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);

    /* Radio based filtering */
    const handleChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    /* Button bases filtering */
    const handleClick = (e) => {
        setSelectedCategory(e.target.value);
    };

    /* Calculate the index range */
    const calculatePageRange = () => {

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;


        return { startIndex, endIndex };
    };

    /* function for the next page */
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    /* function for the previos page */
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        };
    };

    /* Main Functions */
    const filteredData = (jobs, selected, query) => {
        let filteredJobs = jobs;

        // filter input items
        if (query) {
            filteredJobs = filteredItems;
        }

        // category based filtering
        if (selected) {
            filteredJobs = filteredJobs.filter(({ jobLocation, maxPrice, salaryType, employmentType, postingDate, experienceLevel }) => (
                jobLocation.toLowerCase() === selected.toLowerCase() ||
                parseInt(maxPrice) <= parseInt(selected) ||
                postingDate >= selected ||
                salaryType.toLowerCase() === selected.toLowerCase() ||
                employmentType.toLowerCase() === selected.toLowerCase() || experienceLevel.toLowerCase() === selected.toLowerCase()
            ));
            console.log(filteredJobs);
        }

        // slice the data based on current page
        const { startIndex, endIndex } = calculatePageRange();
        filteredJobs = filteredJobs.slice(startIndex, endIndex);

        // Return the filtered jobs as a list of Card components
        return filteredJobs.map((data, i) => (
            <Card key={i} data={data} />
        ));
    };

    const result = filteredData(jobs, selectedCategory, query);

    return (
        <div>
            <Banner
                handleInputChange={handleInputChange}
                query={query}
            />

            {/* main content */}
            <div className="bg-[#fafafa] md:grid grid-cols-4 gap-8 lg:px-[60px] px-4 py-12">
                {/* left side */}
                <div className="bg-white p-4 rounded">
                    <Sidebar handleChange={handleChange} handleClick={handleClick} />
                </div>

                {/* job cards */}
                <div className="col-span-2 bg-white p-2 rounded-sm">

                    {
                        loading ? (
                            <p className='font-medium'>Loading...</p>
                        ) : result.length > 0 ? (<Jobs result={result} />) : <>
                            <h3 className='text-lg font-bold mb-2'>{result.length} Jobs</h3>
                            <p>No jobs found</p>
                        </>
                    }

                    {/* pagination here */}
                    {
                        result.length > 0 ? (
                            <div className='flex justify-center mt-4 space-x-8'>
                                <button onClick={previousPage} disabled={currentPage === 1} className='hover:underline text-primary/70 cursor-pointer'>Previous</button>
                                <span className='text-primary'>Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}</span>
                                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)} className='hover:underline text-primary/70 cursor-pointer'>Next</button>
                            </div>
                        ) : ""
                    }

                </div>

                {/* right side */}
                <div className="bg-white p-4 rounded">
                    <h3 className="font-bold text-2xl text-primary">Newsletter</h3>
                    <NewsLetter />
                </div>
            </div>
        </div>
    )
}

export default Home
