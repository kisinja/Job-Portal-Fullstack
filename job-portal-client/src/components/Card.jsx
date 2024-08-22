import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";

const Card = ({ data }) => {

    const { companyName, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, createdAt, description, jobTitle, skills } = data;

    const formatDate = (date) => {
        return date.split("T")[0];
    }

    return (
        <section className="card">
            <Link to={"/"} className="flex gap-4 flex-col sm:flex-row items-start">
                <div className="w-full h-[150px] mx-auto p-2 shadow flex justify-center">
                    <img src={companyLogo} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-full">
                    <h4 className="text-primary mb-1">{companyName}</h4>
                    <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>

                    <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
                        <span className="flex items-center gap-1">
                            <FiMapPin />{jobLocation}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiClock />
                            {employmentType}
                        </span>
                        <span className="flex items-center gap-1"><FiDollarSign />{minPrice}-{maxPrice}k {salaryType}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiCalendar />
                            {formatDate(createdAt)}
                        </span>
                        {skills ? (
                            <div className="flex gap-2 items-center">
                                <HiOutlineClipboardList />
                                {skills.map((skill, index) => (
                                    <span key={index} className="text-primary/70 bg-primary/10 px-2 py-1 rounded-md text-sm">
                                        {skill.label}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <p className="text-base text-primary/70">{description}</p>
                </div>
            </Link>
        </section>
    )
}

export default Card;