import Button from "../components/Button"
import InputField from "../components/InputField"

const Salary = ({ handleChange, handleClick }) => {
    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Salary</h4>

            <div className="mb-4 md:flex md:justify-between">
                <Button onClickHandler={handleClick} value="" title="Hourly" />
                <Button onClickHandler={handleClick} value="Monthly" title="Monthly" />
                <Button onClickHandler={handleClick} value="Yearly" title="Yearly" />
            </div>

            <div>
                <label className="sidebar-label-container">
                    <input type="radio" name="test" id="test" value="" onChange={handleChange} />
                    <span className="checkmark"></span>All
                </label>

                <InputField handleChange={handleChange} name="test" value={30} title="< 30000k" />
                <InputField handleChange={handleChange} name="test" value={50} title="< 50000k" />
                <InputField handleChange={handleChange} name="test" value={80} title="< 80000k" />
                <InputField handleChange={handleChange} name="test" value={100} title="< 100000k" />
            </div>
        </div>
    )
}

export default Salary
