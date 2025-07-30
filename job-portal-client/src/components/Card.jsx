import { FiCalendar, FiDollarSign, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";

const Card = ({ data }) => {
  const {
    companyName,
    companyLogo,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    createdAt,
    description,
    jobTitle,
    skills,
    applicants = [],
  } = data;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="card group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <Link to={`/job/${data._id}`} className="flex flex-col sm:flex-row">
        {/* Company Logo Section */}
        <div className="w-full sm:w-1/5 md:w-1/2 p-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 group-hover:from-blue-100 group-hover:to-gray-100 transition-all duration-300">
          <div className="w-32 h-32 flex items-center justify-center p-2">
            <img
              src={
                companyLogo ||
                "https://i.pinimg.com/1200x/14/a3/ce/14a3ced5f411ccadbbc172a977695a9a.jpg"
              }
              alt={companyName}
              className="w-full h-full object-contain max-h-24"
            />
          </div>
        </div>

        {/* Job Details Section */}
        <div className="w-full sm:w-4/5 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-1 capitalize">
                {companyName}
              </h4>
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                {jobTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {employmentType}
              </span>
              {applicants.length > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {applicants.length === 1
                    ? `${applicants.length} Applicant`
                    : `${applicants.length} Applicants`}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  No Applicants
                </span>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 capitalize">
              <FiMapPin className="text-gray-400" />
              {jobLocation}
            </span>
            <span className="flex items-center gap-1.5">
              <FiDollarSign className="text-gray-400" />
              {minPrice}-{maxPrice}k {salaryType}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-gray-400" />
              Posted: {formatDate(createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-5 line-clamp-2">{description}</p>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <HiOutlineClipboardList className="text-gray-400" />
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium capitalize w-max"
                >
                  {skill.label}
                </span>
              ))}
            </div>
          )}

          {/* Hover Effect Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
    </section>
  );
};

export default Card;
