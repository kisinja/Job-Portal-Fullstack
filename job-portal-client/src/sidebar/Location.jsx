import InputField from "../components/InputField"

const Location = ({ handleChange }) => {
    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Location</h4>

            <div>
                <label className="sidebar-label-container">
                    <input type="radio" name="test" id="test" value="" onChange={handleChange} />
                    <span className="checkmark"></span>All
                </label>

                <InputField handleChange={handleChange} name="test" value="London" title="London" />
                <InputField handleChange={handleChange} name="test" value="Seattle" title="Seattle" />
                <InputField handleChange={handleChange} name="test" value="Madrid" title="Madrid" />
                <InputField handleChange={handleChange} name="test" value="Boston" title="Boston" />
                <InputField handleChange={handleChange} name="test" value="Nairobi" title="Nairobi" />

            </div>
        </div>
    )
}

export default Location
