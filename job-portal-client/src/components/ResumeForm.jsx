import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const ResumeForm = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
        website: "",
        summary: "",
      },
      experience: [
        {
          company: "",
          role: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
        },
      ],
      education: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: "",
      projects: [
        {
          name: "",
          role: "",
          description: "",
          technologies: "",
          startDate: "",
          endDate: "",
        },
      ],
      certifications: [
        { name: "", issuedBy: "", issueDate: "", expiryDate: "" },
      ],
      hobbies: "",
      languages: [{ name: "", proficiency: "" }],
    },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/resumes`;

  // Field array controllers
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: projectsFields,
    append: appendProjects,
    remove: removeProjects,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: certificationsFields,
    append: appendCertifications,
    remove: removeCertifications,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        setMessage(responseData.message);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setError(responseData.error || "Failed to create resume");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:px-24 px-8 py-6">
      <h1 className="text-center font-light text-4xl mb-4">
        Create your Resume
      </h1>

      <div className="bg-orange-50 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-5">
          {/* Personal Information */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Personal Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block mb-2 text-lg">Full Name</label>
                <Controller
                  name="personalInfo.fullName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter Full Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2 text-lg">Email</label>
                <Controller
                  name="personalInfo.email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Enter Email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block mb-2 text-lg">Phone</label>
                <Controller
                  name="personalInfo.phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter Phone Number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2 text-lg">Address</label>
                <Controller
                  name="personalInfo.address"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block mb-2 text-lg">LinkedIn</label>
                <Controller
                  name="personalInfo.linkedin"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter LinkedIn Profile"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block mb-2 text-lg">GitHub</label>
                <Controller
                  name="personalInfo.github"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter GitHub Profile"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-lg">Website</label>
              <Controller
                name="personalInfo.website"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter Website"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-lg">Summary</label>
              <Controller
                name="personalInfo.summary"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Enter a brief summary"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Experience
            </h1>

            {experienceFields.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Company</label>
                    <Controller
                      name={`experience[${index}].company`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Company Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Role</label>
                    <Controller
                      name={`experience[${index}].role`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Role"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-lg">Description</label>
                  <Controller
                    name={`experience[${index}].description`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Describe your role"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Start Date</label>
                    <Controller
                      name={`experience[${index}].startDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">End Date</label>
                    <Controller
                      name={`experience[${index}].endDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-lg">Location</label>
                  <Controller
                    name={`experience[${index}].location`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter Location"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendExperience({
                  company: "",
                  role: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  location: "",
                })
              }
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Experience
            </button>
          </div>

          {/* Education */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Education
            </h1>

            {educationFields.map((edu, index) => (
              <div
                key={edu.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Institution</label>
                    <Controller
                      name={`education[${index}].institution`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Institution Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Degree</label>
                    <Controller
                      name={`education[${index}].degree`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Degree"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Field of Study</label>
                    <Controller
                      name={`education[${index}].fieldOfStudy`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Field of Study"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Location</label>
                    <Controller
                      name={`education[${index}].location`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Location"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Start Date</label>
                    <Controller
                      name={`education[${index}].startDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">End Date</label>
                    <Controller
                      name={`education[${index}].endDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendEducation({
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Education
            </button>
          </div>

          {/* Skills */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Skills
            </h1>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block mb-2 text-lg">
                Skills (comma separated)
              </label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Enter skills separated by commas"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Projects */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Projects
            </h1>

            {projectsFields.map((project, index) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Project Name</label>
                    <Controller
                      name={`projects[${index}].name`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Project Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Role</label>
                    <Controller
                      name={`projects[${index}].role`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Your Role"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-lg">Description</label>
                  <Controller
                    name={`projects[${index}].description`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Describe the Project"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">
                      Technologies Used
                    </label>
                    <Controller
                      name={`projects[${index}].technologies`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Technologies Used"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Start Date</label>
                    <Controller
                      name={`projects[${index}].startDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-lg">End Date</label>
                  <Controller
                    name={`projects[${index}].endDate`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProjects(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendProjects({
                  name: "",
                  role: "",
                  description: "",
                  technologies: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Project
            </button>
          </div>

          {/* Certifications */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Certifications
            </h1>

            {certificationsFields.map((cert, index) => (
              <div
                key={cert.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">
                      Certification Name
                    </label>
                    <Controller
                      name={`certifications[${index}].name`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Certification Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Issued By</label>
                    <Controller
                      name={`certifications[${index}].issuedBy`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Issuer"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-lg">Issue Date</label>
                    <Controller
                      name={`certifications[${index}].issueDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-lg">Expiry Date</label>
                    <Controller
                      name={`certifications[${index}].expiryDate`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertifications(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                >
                  Remove Certification
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendCertifications({
                  name: "",
                  issuedBy: "",
                  issueDate: "",
                  expiryDate: "",
                })
              }
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Certification
            </button>
          </div>

          {/* Hobbies */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Hobbies
            </h1>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block mb-2 text-lg">
                Hobbies (comma separated)
              </label>
              <Controller
                name="hobbies"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Enter hobbies separated by commas"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8 flex flex-col gap-5">
            <h1 className="font-bold text-lg text-primary text-center">
              Languages
            </h1>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {languageFields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
                >
                  <div>
                    <label className="block mb-2 text-sm">Language</label>
                    <Controller
                      name={`languages[${index}].name`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Language name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Proficiency</label>
                    <Controller
                      name={`languages[${index}].proficiency`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select proficiency</option>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Basic">Basic</option>
                        </select>
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="bg-red-500 text-white py-3 px-3 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendLanguage({ name: "", proficiency: "" })}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Add Language
              </button>
            </div>
          </div>

          {/* Messages and Submit */}
          {message && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {loading && <Loader />}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Resume"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
