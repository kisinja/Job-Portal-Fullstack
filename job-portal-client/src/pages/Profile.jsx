import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import CreatableSelect from 'react-select/creatable';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, dispatch } = useAuthContext();
    const { userId } = useParams();
    const BASE_URL = 'https://techposter-backend.onrender.com/api/profile';

    const [userProfile, setUserProfile] = useState({
        username: '',
        email: '',
        bio: '',
        role: '',
        profilePic: '',
        userSkills: [], // Ensure this is always an array
        experience: 0, // Add experience field
        education: '', // Add education field
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setUserProfile(data.user);
                    setLoading(false);
                } else {
                    setError(data.error);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getProfile();

    }, [BASE_URL, user.token, userId]);

    const handleChange = (e) => {
        setUserProfile({
            ...userProfile,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setUserProfile({
            ...userProfile,
            profilePic: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', userProfile.username);
        formData.append('email', userProfile.email);
        formData.append('bio', userProfile.bio);
        formData.append('role', userProfile.role);
        formData.append('experience', userProfile.experience); // Include experience
        formData.append('education', userProfile.education); // Include education
        formData.append('userSkills', JSON.stringify(userProfile.userSkills)); // Add skills to form data

        if (userProfile.profilePic instanceof File) {
            formData.append('profilePic', userProfile.profilePic);
        }

        try {
            const res = await fetch(`${BASE_URL}/update/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                console.log(data);
                setUserProfile(data.user);
                setIsEditing(false);
                const updatedUser = { ...user, ...data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                dispatch({ type: 'UPDATE_USER', payload: data.user });
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.log(error.message);
            setError('Failed to update profile');
        }
    };

    const handleSkillChange = (skills) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            userSkills: skills.map(skill => skill.value) // Convert selected options to array of skill values
        }));
    };

    const skillOptions = userProfile.userSkills.map(skill => ({ value: skill, label: skill }));

    return (
        <div className='max-w-screen-2xl container xl:px-24 p-4 py-4 relative'>

            {/* Sidebar */}
            <div className="w-1/4 bg-blue p-4 rounded-lg shadow-lg absolute">
                <h2 className="text-lg font-bold mb-4 ">Navigation</h2>
                <ul className="space-y-2">
                    <li>
                        <Link to={`/profile/${userId}`} className="text-white hover:text-blue-700">Profile</Link>
                    </li>
                    <li>
                        <Link to={`/profile/${userId}/applied-jobs`} className="text-white hover:text-blue-700">Applied Jobs</Link>
                    </li>
                </ul>
            </div>

            {/* Profile Content */}
            <div className="w-3/4 ml-6 flex justify-center items-center">
                {loading && <Loader />}

                {!loading && userProfile && (
                    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center justify-center mt-4">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-blue object-cover"
                                src={`https://techposter-backend.onrender.com/uploads/${user.profilePic}`}
                                alt="Profile"
                            />
                            {isEditing && (
                                <input
                                    type="file"
                                    name="profilePic"
                                    onChange={handleFileChange}
                                    className="mt-2"
                                />
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="mt-6 py-6 px-12 flex flex-col gap-3">
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Username:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={userProfile.username}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.username}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Email:</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={userProfile.email}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.email}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Role:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="role"
                                        value={userProfile.role}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.role}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Bio:</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={userProfile.bio}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    ></textarea>
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.bio}</span>
                                )}
                            </div>

                            {/* Experience Input Section */}
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Experience (years):</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="experience"
                                        value={userProfile.experience}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        min="0"
                                    />
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.experience} years</span>
                                )}
                            </div>

                            {/* Education Input Section */}
                            <div>
                                <label className="text-lg font-semibold text-gray-800">Education:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="education"
                                        value={userProfile.education}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span className='ml-2 text-primary/70'>{userProfile.education}</span>
                                )}
                            </div>

                            {/* Skills Input Section */}
                            {isEditing ? (
                                <div>
                                    <label className="text-lg font-semibold text-gray-800">Skills:</label>
                                    <CreatableSelect
                                        isMulti
                                        value={skillOptions}
                                        onChange={handleSkillChange}
                                        placeholder="Add or select skills..."
                                        className="w-full mt-1"
                                    />
                                </div>
                            ) : (
                                <div className='flex gap-2 flex-col'>
                                    <label className="text-lg font-semibold text-gray-800">Skills:</label>
                                    <ul className='ml-2 text-primary/70'>
                                        {userProfile.userSkills.map((skill, index) => (
                                            <li key={index}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {error && <div className="error">{error}</div>}
                            {isEditing && (
                                <button
                                    type="submit"
                                    className="w-full mt-4 bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;