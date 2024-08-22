import { FaGithub, FaInstagram, FaLinkedin, FaPinterest, FaXTwitter } from "react-icons/fa6"

const Footer = () => {

    const year = new Date().getFullYear();

    return (
        <footer className="bg-black text-gray-400 px-[5%] py-8 mt-8">
            <div className="container max-w-screen-2xl flex flex-col gap-4">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-gray-50 underline">Useful Links</h3>
                        <ul className="flex flex-col gap-2">
                            <li className="text-sm hover:text-blue cursor-pointer">Careers</li>
                            <li className="text-sm hover:text-blue cursor-pointer">Customer Care</li>
                            <li className="text-sm hover:text-blue cursor-pointer">
                                <a href="/privacy-policy">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-gray-50 underline">Follow Us</h3>
                        <ul className="flex gap-2">
                            <li className="text-lg hover:text-blue cursor-pointer">
                                <FaInstagram />
                            </li>
                            <li className="text-lg hover:text-blue cursor-pointer">
                                <FaLinkedin />
                            </li>
                            <li className="text-lg hover:text-blue cursor-pointer">
                                <FaGithub />
                            </li>
                            <li className="text-lg hover:text-blue cursor-pointer">
                                <FaXTwitter />
                            </li>
                            <li className="text-lg hover:text-blue cursor-pointer">
                                <FaPinterest />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <small className="tracking-wider">
                        &copy; Copyright TechPoster {year}
                    </small>
                </div>
            </div>
        </footer>
    )
}

export default Footer