import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import FlashMessage from "../components/FlashMessage";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [flashMessage, setFlashMessage] = useState('');

    const { login, error, loading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);

        setFlashMessage(error);
    };

    const clearMessage = () => {
        setFlashMessage('');
    };


    return (
        <section id="login-page">

            <FlashMessage message={flashMessage} clearMessage={clearMessage} />

            <form onSubmit={handleSubmit} className="bg-white py-8 px-12 min-w-screen-lg">
                <h1 className="text-3xl mb-3">Login</h1>
                <div className="flex flex-col mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        autoComplete="off"
                        name="email" id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 rounded-md p-1 outline-none w-full"
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        autoComplete="off"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 rounded-md p-1 outline-none w-full"
                    />
                </div>

                <p className="text-sm text-primary">Don{"'"}t have an account ?
                    <a href="/signup" className="text-blue">Sign Up</a>
                </p>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="mx-auto bg-blue text-white py-2 px-5 rounded-md flex justify-center items-center mt-3" disabled={loading}>
                    Login
                </button>
            </form>
        </section>
    )
}

export default Login