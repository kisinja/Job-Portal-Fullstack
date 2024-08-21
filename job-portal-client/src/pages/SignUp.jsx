import { useState } from "react";
import { useSignUp } from '../hooks/useSignUp';
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { error, loading, signUp } = useSignUp();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signUp(username, email, password);

        navigate('/login');

        setUsername('');
        setEmail('');
        setPassword('');
    };


    return (
        <section id="signup-page">
            <form onSubmit={handleSubmit} className="bg-white py-8 px-12 min-w-screen-lg">
                <h1 className="text-3xl mb-2">Sign Up</h1>
                <div className="flex flex-col mb-3">
                    <label htmlFor="name" className="text-base text-primary">Username</label>
                    <input
                        type="text"
                        autoComplete="off" name="username" id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-2 rounded-md p-1 outline-none w-full"
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        autoComplete="off" name="email" id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 rounded-md p-1 outline-none w-full"
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        autoComplete="off" name="password" id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 rounded-md p-1 outline-none w-full"
                    />
                </div>

                <p className="text-sm text-primary">
                    Already have an account? <a href="/login" className="text-blue">Login</a>
                </p>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="mx-auto bg-blue text-white py-2 px-5 rounded-md flex justify-center items-center mt-3">
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>
        </section>
    );
};

export default SignUp
