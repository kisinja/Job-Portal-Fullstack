import InputField from "../components/InputField"

const JobPostingData = ({ handleChange }) => {
    const now = new Date();

    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);


    // convert date to string
    const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().split('T')[0];
    const sevenDaysAgoDate = sevenDaysAgo.toISOString().split('T')[0];
    const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().split('T')[0];



    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Date of posting</h4>

            <div>
                <label className="sidebar-label-container">
                    <input type="radio" name="test" id="test" value="" onChange={handleChange} />
                    <span className="checkmark"></span>All time
                </label>

                <InputField handleChange={handleChange} name="test" value={twentyFourHoursAgoDate} title="Last 24 hours" />
                <InputField handleChange={handleChange} name="test" value={sevenDaysAgoDate} title="Last 7 days" />
                <InputField handleChange={handleChange} name="test" value={thirtyDaysAgoDate} title="Last Month" />
            </div>
        </div>
    )
}

export default JobPostingData
