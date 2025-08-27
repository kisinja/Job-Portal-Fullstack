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

                <InputField handleChange={handleChange} name="test" value="Eldoret" title="Eldoret" />
                <InputField handleChange={handleChange} name="test" value="Mombasa" title="Mombasa" />
                <InputField handleChange={handleChange} name="test" value="Nakuru" title="Nakuru" />
                <InputField handleChange={handleChange} name="test" value="Kisumu" title="Kisumu" />
                <InputField handleChange={handleChange} name="test" value="Nairobi" title="Nairobi" />

            </div>
        </div>
    )
}

export default Location
