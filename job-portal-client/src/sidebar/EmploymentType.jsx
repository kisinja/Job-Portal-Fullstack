import InputField from "../components/InputField"

const EmploymentType = ({ handleChange }) => {
    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Type of employment</h4>

            <div>
                <label className="sidebar-label-container">
                    <input type="radio" name="test" id="test" value="" onChange={handleChange} />
                    <span className="checkmark"></span>All Types
                </label>

                <InputField handleChange={handleChange} name="test" value="full-time" title="Full-time" />
                <InputField handleChange={handleChange} name="test" value="Temporary" title="Temporary" />
                <InputField handleChange={handleChange} name="test" value="Part-time" title="Part-time" />
            </div>
        </div>
    )
}

export default EmploymentType
