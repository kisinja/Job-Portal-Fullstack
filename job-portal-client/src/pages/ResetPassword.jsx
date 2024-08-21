import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {

    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const BASE_URL = 'https://techposter-backend.onrender.com/api/auth/reset-password';

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            const response = await fetch(`${BASE_URL}/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                navigate('/login');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Something went wrong.');
            console.log(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-gray-700">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {message && <div className="message">{message}</div>}
                {error && <div className="error">{error}</div>}

                <button
                    type="submit"
                    className="w-full bg-blue text-white p-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;