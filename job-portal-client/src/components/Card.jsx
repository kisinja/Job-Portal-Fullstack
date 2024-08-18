import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const Card = ({ data }) => {

    const { companyName, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, postingDate, description, jobTitle } = data;

    return (
        <section className="card">
            <Link to={"/"} className="flex gap-4 flex-col sm:flex-row items-start">
                <div className="w-[250px] h-[100px] p-2 shadow">
                    <img src={companyLogo} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="">
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
                            {postingDate}
                        </span>
                    </div>

                    <p className="text-base text-primary/70">{description}</p>
                </div>
            </Link>
        </section>
    )
}

export default Card;