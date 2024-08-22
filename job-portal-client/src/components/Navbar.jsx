import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBarsStaggered as FaBar, FaXmark } from 'react-icons/fa6';
import { useAuthContext } from '../hooks/useAuthContext';
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user } = useAuthContext();

    const handleMenuToggler = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        {
            title: 'Start a Search',
            path: '/'
        },
        {
            title: 'Salary Estimate',
            path: '/salary'
        },
        {
            title: 'Post a Job',
            path: '/post-job'
        }
    ];

    const handleClick = () => {
        localStorage.removeItem('user');

        window.location.href = '/';
    };

    return (
        <header className='max-w-screen-2xl container mx-auto xl:px-24 px-4 shadow-sm'>
            <nav className='flex justify-between items-center py-6'>
                <a href="/" className='flex items-center gap-2 text-2xl text-black' id='logo'>
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
                        <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
                    </svg>
                    <span>TechPoster</span>
                </a>

                {/* Nav items for large devices */}
                <ul className='hidden md:flex gap-12'>
                    {navItems.map(({ path, title }) => (
                        <li key={path} className='text-base text-primary'>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            >
                                {title}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Signup and login buttons */}
                <div className="text-base font-medium space-x-5 hidden lg:block">
                    {
                        user ? (
                            <div className='flex items-center gap-3'>
                                <Link to={`/my-jobs/${user._id}`}>
                                    My Jobs
                                </Link>
                                <Link to={`/profile/${user._id}`} className="py-2 px-5 text-base text-primary">
                                    Profile ({user.username})
                                </Link>
                                <Link to="" className="py-2 px-5 text-red-600 text-base" onClick={handleClick}>
                                    <IoLogOutOutline className='text-2xl' title='Sign out' />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="py-2 px-5 border rounded">Log In</Link>
                                <Link to="/signup" className="py-2 px-5 border rounded bg-blue text-white">Sign up</Link>
                            </>
                        )
                    }
                </div>

                {/* mobile menu */}
                <div className='md:hidden block'>
                    <button onClick={handleMenuToggler}>
                        {
                            isMenuOpen ? <FaXmark className='w-5 h-5 text-primary' /> : <FaBar className='w-5 h-5 text-primary' />
                        }
                    </button>
                </div>
            </nav >

            {/* Nav items for mobile devices */}
            < div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
                <ul className=''>
                    {navItems.map(({ path, title }) => (
                        <li key={path} className='text-base text-white first:text-white py-1'>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'active'
                                        : ''
                                }
                                onClick={handleMenuToggler}
                            >
                                {title}
                            </NavLink>
                        </li>
                    ))}
                    {
                        user ? (
                            <>
                                <li>
                                    <Link to={`/my-jobs/${user._id}`} className='text-white'>
                                        My Jobs
                                    </Link>
                                </li>
                                <li className='text-gray-500'>Hi, {user.username}</li>
                                <li>
                                    <Link to={`/profile/${user._id}`} className="text-white">Profile</Link>
                                </li>
                                <li>
                                    <Link to="" className=" text-white" onClick={handleClick}>Log out</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="">Log In</Link>
                                <Link to="/signup" className="text-white">Sign up</Link>
                            </>
                        )
                    }
                </ul>
            </ div >
        </header >
    )
}

export default Navbar
