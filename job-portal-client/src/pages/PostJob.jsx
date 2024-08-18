import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PostJob = () => {

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const BASE_URL = 'https://techposter-backend.onrender.com/api/jobs';

    const { user } = useAuthContext();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        data.skills = selectedOptions;
        console.log(data);

        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            setLoading(false);
            const data = await res.json();
            console.log(data);
            setMessage(data.message);
            navigate('/');
        }

        if (!res.ok) {
            setLoading(false);
            const data = await res.json();
            console.log(data.error);
        }
    };

    // Manually register the field
    useEffect(() => {
        register('skills'); // Register 'skills' field with react-hook-form
    }, [register]);

    const options = [
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'C++', label: 'C++' },
        { value: 'HTML', label: 'HTML' },
        { value: 'CSS', label: 'CSS' },
        { value: 'React', label: 'React' },
        { value: 'Node', label: 'Node' },
        { value: 'MongoDB', label: 'MongoDB' },
        { value: 'Redux', label: 'Redux' },
    ];

    // Handle the onChange event for CreatableSelect
    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        setValue('skills', selectedOptions); // Set value in react-hook-form
    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            {/* form */}
            <div className="bg-[#fafafa] py-10 px-4 lg:px-16">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* 1st row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Job Title</label>
                            <input
                                type="text"
                                defaultValue="Web Developer"
                                placeholder='Enter Job Title'
                                {...register('jobTitle')}
                                className='create-job-input'
                            />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Company Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Microsoft"
                                {...register('companyName')}
                                className='create-job-input'
                            />
                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Minimum Salary</label>
                            <input
                                type="number"
                                max={100000}
                                min={5}
                                placeholder='$20k'
                                {...register('minPrice')}
                                className='create-job-input'
                            />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Maximum Salary</label>
                            <input
                                type="number"
                                max={100000}
                                min={5}
                                placeholder='$120k'
                                {...register('maxPrice')}
                                className='create-job-input'
                            />
                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Salary Type</label>
                            <select {...register("salaryType")} className='create-job-input'>
                                <option value="">Choose your salary</option>
                                <option value="Hourly">Hourly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Job Location</label>
                            <input
                                type="text"
                                placeholder='Ex: Nairobi'
                                {...register('jobLocation')}
                                className='create-job-input'
                            />
                        </div>
                    </div>

                    {/* 4th row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Job Posting Date</label>
                            <input
                                type="date"
                                {...register('postingDate')}
                                className='create-job-input'
                            />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Experience Level</label>
                            <select {...register("experienceLevel")} className='create-job-input'>
                                <option value="">Select your Experience Level</option>
                                <option value="Any experience">Any experience</option>
                                <option value="Internship">Internship</option>
                                <option value="Work remotely">Work remotely</option>
                            </select>
                        </div>
                    </div>

                    {/* 5th row */}
                    <div>
                        <label className="block mb-2 text-lg">Required Skill Sets:</label>

                        {/* react-select */}
                        <CreatableSelect
                            className='create-job-input py-4'
                            defaultValue={selectedOptions}
                            onChange={handleChange}
                            options={options}
                            isMulti
                        />
                    </div>

                    {/* 6th row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Company Logo</label>
                            <input
                                type="url"
                                placeholder='Paste your image url https://weshare.com/img1.jpg'
                                {...register('companyLogo')}
                                className='create-job-input'
                            />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Employment Type</label>
                            <select {...register("employmentType")} className='create-job-input'>
                                <option value="">Select your job type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Temporary">Temporary</option>
                            </select>
                        </div>
                    </div>

                    {/* 7th row */}
                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Job Description</label>
                        <textarea
                            placeholder='Job Description'
                            {...register('description')}
                            className='create-job-input w-full pl-3 py-1.5 focus:outline-none resize-none placeholder:text-gray-500'
                            rows={6}
                            defaultValue={"This is the default job description. Type in your own and continue with the form! 🥳😁😎❗"}
                        />
                    </div>

                    {/* last row */}
                    <div className='w-full'>
                        <label className="block text-lg mb-2">Job Posted By</label>

                        <input
                            type="email"
                            placeholder='your email'
                            {...register('postedBy')}
                            className='create-job-input'
                        />
                    </div>

                    {/* message */}
                    {message && <div className='text-center text-green-500 font-semibold'>
                        {message}
                    </div>}

                    {/* submit input */}
                    <input type="submit" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer' value={loading ? "Loading..." : "Post Job"} />
                </form>
            </div>
        </div>
    )
}

export default PostJob;
