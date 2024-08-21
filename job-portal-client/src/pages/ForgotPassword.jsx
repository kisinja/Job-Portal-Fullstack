import { useState } from "react";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* const BASE_URL = 'http://localhost:7777/api/auth/forgot-password'; */

    const BASE_URL = 'https://techposter-backend.onrender.com/api/auth/forgot-password';

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setError('');
                setIsLoading(false);
            } else {
                setError(data.error);
                setMessage('');
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto xl:px-24 px-4 py-8">
            <h2 className="font-bold text-2xl mb-4">Forgot Password</h2>

            <form className="space-y-4" onSubmit={handleClick}>
                <div>
                    <label className="block text-primary/70">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {error && <div className="error">{error}</div>}
                {message && <div className="message">{message}</div>}

                <button
                    type="submit"
                    className="w-full bg-blue text-white p-2 rounded font-semibold"
                >
                    {isLoading ? 'Processing...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;