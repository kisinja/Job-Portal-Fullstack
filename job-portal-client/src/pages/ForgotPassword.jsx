import { useState } from "react";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* const BASE_URL = 'http://localhost:7777/api/auth/forgot-password'; */

    const BASE_URL = 'https://techposter-backend.onrender.com/api/auth/forgot-password';

    const handleClick = async (e) => {
        setIsLoading(true);
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

            if (error.message === "Failed to fetch") {
                setError("ERR:CONNECTION REFUSED");
            }

            console.log(error.message);
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto xl:px-24 px-4 py-8">
            <div className="mx-auto bg-orange-50 w-fit p-2 rounded shadow flex flex-col gap-1">
                <h2 className="font-light text-2xl">Forgot Password?</h2>
                <p className="text-primary/70 font-light">Submit your email and we will send you a reset link in your inbox.</p>
                <p className="text-primary text-sm">
                    <span className="text-red-600">*</span>
                    The links expires in 1 hr
                </p>
            </div>
            <form className="space-y-4 w-[480px] mx-auto p-8 shadow rounded mt-4" onSubmit={handleClick}>
                <div>
                    <label className="block text-primary">Email <span className="text-red-600">*</span> </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                        required
                        placeholder="your email address"
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