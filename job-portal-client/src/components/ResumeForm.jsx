import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Loader from './Loader';
import { useAuthContext } from '../hooks/useAuthContext';

const ResumeForm = () => {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                linkedin: '',
                github: '',
                website: '',
                summary: ''
            },
            experience: [{ company: '', role: '', description: '', startDate: '', endDate: '', location: '' }],
            education: [{ institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '' }],
            skills: '',
            projects: [{ name: '', role: '', description: '', technologies: '', startDate: '', endDate: '' }],
            certifications: [{ name: '', issuedBy: '', issueDate: '', expiryDate: '' }],
            hobbies: '',
            languages: [{ name: '', proficiency: '' }],
        }
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useAuthContext();

    const BASE_URL = 'http://localhost:7777/api/resumes';

    const { fields: experienceFields, append: appendExperience } = useFieldArray({
        control,
        name: 'experience'
    });

    const { fields: educationFields, append: appendEducation } = useFieldArray({
        control,
        name: 'education'
    });

    const { fields: projectsFields, append: appendProjects } = useFieldArray({
        control,
        name: 'projects'
    });

    const { fields: certificationsFields, append: appendCertifications } = useFieldArray({
        control,
        name: 'certifications'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'languages',
    });

    const onSubmit = async (data) => {
        console.log(data);
        setLoading(true);

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data)
            setMessage(data.message);
            setLoading(false);
        }
        if (!res.ok) {
            const data = await res.json();
            console.log(data)
            setMessage(data.error);
            setLoading(false);
        }

        setMessage("");
        setError("");
    };

    return (
        <div className='xl:px-24 px-8 py-6'>



            <div className='bg-orange-50'>
                <form onSubmit={handleSubmit(onSubmit)} className="p-5">

                    {/* 1st Row - Personal Information */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Personal Information</h1>

                        <div className='create-job-flex mb-5'>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>Full Name</label>
                                <Controller
                                    name="personalInfo.fullName"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter Full Name' className='create-job-input' />}
                                />
                            </div>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>Email</label>
                                <Controller
                                    name="personalInfo.email"
                                    control={control}
                                    render={({ field }) => <input {...field} type="email" placeholder='Enter Email' className='create-job-input' />}
                                />
                            </div>
                        </div>

                        <div className='create-job-flex mb-5'>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>Phone</label>
                                <Controller
                                    name="personalInfo.phone"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter Phone Number' className='create-job-input' />}
                                />
                            </div>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>Address</label>
                                <Controller
                                    name="personalInfo.address"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter Address' className='create-job-input' />}
                                />
                            </div>
                        </div>

                        <div className='create-job-flex mb-5'>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>LinkedIn</label>
                                <Controller
                                    name="personalInfo.linkedin"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter LinkedIn Profile' className='create-job-input' />}
                                />
                            </div>
                            <div className='lg:w-1/2 w-full'>
                                <label className='block mb-2 text-lg'>GitHub</label>
                                <Controller
                                    name="personalInfo.github"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter GitHub Profile' className='create-job-input' />}
                                />
                            </div>
                        </div>

                        <div className='create-job-flex mb-5'>
                            <div className='w-full'>
                                <label className='block mb-2 text-lg'>Website</label>
                                <Controller
                                    name="personalInfo.website"
                                    control={control}
                                    render={({ field }) => <input {...field} type="text" placeholder='Enter Website' className='create-job-input' />}
                                />
                            </div>
                        </div>

                        <div className='create-job-flex mb-5'>
                            <div className='w-full'>
                                <label className='block mb-2 text-lg'>Summary</label>
                                <Controller
                                    name="personalInfo.summary"
                                    control={control}
                                    render={({ field }) => <textarea {...field} placeholder='Enter a brief summary' className='create-job-input' />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2nd Row - Experience */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Experience</h1>

                        {experienceFields.map((exp, index) => (
                            <div key={exp.id}>
                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Company</label>
                                        <Controller
                                            name={`experience[${index}].company`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Company Name' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Role</label>
                                        <Controller
                                            name={`experience[${index}].role`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Role' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='w-full'>
                                        <label className='block mb-2 text-lg'>Description</label>
                                        <Controller
                                            name={`experience[${index}].description`}
                                            control={control}
                                            render={({ field }) => <textarea {...field} placeholder='Describe your role' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Start Date</label>
                                        <Controller
                                            name={`experience[${index}].startDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>End Date</label>
                                        <Controller
                                            name={`experience[${index}].endDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='w-full'>
                                        <label className='block mb-2 text-lg'>Location</label>
                                        <Controller
                                            name={`experience[${index}].location`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Location' className='create-job-input' />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendExperience({ company: '', role: '', description: '', startDate: '', endDate: '', location: '' })}
                            className='bg-blue text-white py-2 px-4 rounded'
                        >
                            Add Experience
                        </button>
                    </div>

                    {/* 3rd Row - Education */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Education</h1>

                        {educationFields.map((edu, index) => (
                            <div key={edu.id}>
                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Institution</label>
                                        <Controller
                                            name={`education[${index}].institution`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Institution Name' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Degree</label>
                                        <Controller
                                            name={`education[${index}].degree`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Degree' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Field of Study</label>
                                        <Controller
                                            name={`education[${index}].fieldOfStudy`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Field of Study' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Location</label>
                                        <Controller
                                            name={`education[${index}].location`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Location' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Start Date</label>
                                        <Controller
                                            name={`education[${index}].startDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>End Date</label>
                                        <Controller
                                            name={`education[${index}].endDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendEducation({ institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '' })}
                            className='bg-blue text-white py-2 px-4 rounded'
                        >
                            Add Education
                        </button>
                    </div>

                    {/* 4th Row - Skills */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Skills</h1>

                        <div className='create-job-flex mb-5'>
                            <div className='w-full'>
                                <label className='block mb-2 text-lg'>Skills</label>
                                <Controller
                                    name="skills"
                                    control={control}
                                    render={({ field }) => <textarea {...field} placeholder='Enter Skills' className='create-job-input' />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5th Row - Projects */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Projects</h1>

                        {projectsFields.map((project, index) => (
                            <div key={project.id}>
                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Project Name</label>
                                        <Controller
                                            name={`projects[${index}].name`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Project Name' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Role</label>
                                        <Controller
                                            name={`projects[${index}].role`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Your Role' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='w-full'>
                                        <label className='block mb-2 text-lg'>Description</label>
                                        <Controller
                                            name={`projects[${index}].description`}
                                            control={control}
                                            render={({ field }) => <textarea {...field} placeholder='Describe the Project' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Technologies Used</label>
                                        <Controller
                                            name={`projects[${index}].technologies`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Technologies Used' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Start Date</label>
                                        <Controller
                                            name={`projects[${index}].startDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>End Date</label>
                                        <Controller
                                            name={`projects[${index}].endDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendProjects({ name: '', role: '', description: '', technologies: '', startDate: '', endDate: '' })}
                            className='bg-blue text-white py-2 px-4 rounded'
                        >
                            Add Project
                        </button>
                    </div>

                    {/* 6th Row - Certifications */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Certifications</h1>

                        {certificationsFields.map((cert, index) => (
                            <div key={cert.id}>
                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Certification Name</label>
                                        <Controller
                                            name={`certifications[${index}].name`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Certification Name' className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Issued By</label>
                                        <Controller
                                            name={`certifications[${index}].issuedBy`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" placeholder='Enter Issuer' className='create-job-input' />}
                                        />
                                    </div>
                                </div>

                                <div className='create-job-flex mb-5'>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Issue Date</label>
                                        <Controller
                                            name={`certifications[${index}].issueDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                    <div className='lg:w-1/2 w-full'>
                                        <label className='block mb-2 text-lg'>Expiry Date</label>
                                        <Controller
                                            name={`certifications[${index}].expiryDate`}
                                            control={control}
                                            render={({ field }) => <input {...field} type="date" className='create-job-input' />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendCertifications({ name: '', issuedBy: '', issueDate: '', expiryDate: '' })}
                            className='bg-blue text-white py-2 px-4 rounded'
                        >
                            Add Certification
                        </button>
                    </div>

                    {/* 7th Row - Hobbies */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Hobbies</h1>

                        <div className='create-job-flex mb-5'>
                            <div className='w-full'>
                                <label className='block mb-2 text-lg'>Hobbies</label>
                                <Controller
                                    name="hobbies"
                                    control={control}
                                    render={({ field }) => <textarea {...field} placeholder='Enter Hobbies' className='create-job-input' />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 8th Row - Languages */}
                    <div className='mb-8 flex flex-col gap-5'>
                        <h1 className="font-bold text-lg text-primary text-center">Languages</h1>

                        <div className='mb-5'>
                            <label className='block mb-2 text-lg'>Languages</label>
                            {fields.map((item, index) => (
                                <div key={item.id} className='mb-4 flex gap-4'>
                                    <div className='w-full'>
                                        <Controller
                                            name={`languages[${index}].name`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Language name"
                                                    className='create-job-input'
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Controller
                                            name={`languages[${index}].proficiency`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Proficiency level"
                                                    className='create-job-input placeholder:text-sm'
                                                />
                                            )}
                                        />
                                    </div>
                                    <button type="button" onClick={() => remove(index)} className='bg-red-600 text-white py-1 px-3'>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => append({ name: '', proficiency: '' })} className='bg-blue text-white py-1 px-3'>
                                Add Language
                            </button>
                        </div>
                    </div>

                    {message && <div className='message'>{message}</div>}
                    {error && <div className='error'>{error}</div>}
                    {loading && <Loader />}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='bg-green-500 text-white py-2 px-4 rounded'
                    >
                        Create Resume
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResumeForm;
