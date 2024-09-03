import { FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

const GetNoticed = () => {
    return (
        <div className="w-full bg-white p-4 rounded shadow flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <FaRocket className="text-blue text-xl" />
                Get noticed faster
            </h3>
            <p className="text-primary/70 text-sm">
                Introducing our new resume builder: easily create and customize your resume directly on our platform!
            </p>


            <button type="submit" className="bg-blue text-white py-2 px-5 rounded-md focus:bg-orange-50 focus:text-black focus:ring-4 focus:ring-blue focus:outline-none">
                <Link to="/generate-resume">
                    Try it Now
                </Link>
            </button>
        </div>
    )
}

export default GetNoticed