import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import CreatableSelect from 'react-select/creatable';

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
        userSkills: [],  // Ensure this is always an array
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
        formData.append('userSkills', JSON.stringify(userProfile.userSkills));  // Add skills to form data

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
            userSkills: skills.map(skill => skill.value)  // Convert selected options to array of skill values
        }));
    };

    const skillOptions = userProfile.userSkills.map(skill => ({ value: skill, label: skill }));

    return (
        <div className='max-w-screen-2xl container xl:px-24 p-4 py-4'>

            {loading && <div className='text-center'>Loading...</div>}

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
                            <div className='flex items-center gap-2'>
                                <label className="text-lg font-semibold text-gray-800">Skills:</label>
                                <div className='flex flex-wrap gap-2'>
                                    {userProfile.userSkills.map((skill, index) => (
                                        <span key={index} className='bg-white p-1 rounded border'>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEditing ? (
                            <button type="submit" className="mt-4 bg-blue text-white p-2 rounded-md">
                                Save Changes
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="mt-4 bg-yellow-500 text-white p-2 rounded-md"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </form>
                </div>
            )}

            {error && <div className='error'>{error}</div>}
        </div>
    );
};

export default Profile;