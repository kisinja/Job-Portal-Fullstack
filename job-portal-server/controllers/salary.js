const calculateEstimatedSalary = (experienceLevel, jobTitle, location, industry) => {
    let baseSalary = 70000;

    // modify base salary based on experience level
    if (experienceLevel === 'Entry') baseSalary *= 1;
    else if (experienceLevel === 'Mid') baseSalary *= 1.5;
    else if (experienceLevel === 'Senior') baseSalary *= 2;

    // modify base salary based on job title
    if (jobTitle === 'Software Engineer') baseSalary *= 1;
    else if (jobTitle.toLowerCase() === 'Product Manager') baseSalary *= 1.5;
    else if (jobTitle.toLowerCase().includes('manager') === 'Data Scientist') baseSalary *= 2;

    // modify base salary based on industry
    if (industry === 'Technology') baseSalary *= 1;
    else if (industry === 'Finance') baseSalary *= 1.5;
    else if (industry === 'Healthcare') baseSalary *= 2;

    // modify base salary based on location
    if (location === 'San Francisco') baseSalary *= 2;
    else if (location === 'New York') baseSalary *= 1.5;
    else if (location === 'Austin') baseSalary *= 1;

    return baseSalary;
};

// Get estimated salary for a job
export const getSalaryEstimate = (req, res) => {
    try {
        const { experienceLevel, jobTitle, location, industry } = req.body;

        if (!experienceLevel || !jobTitle || !location || !industry) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        const estimatedSalary = calculateEstimatedSalary(experienceLevel, jobTitle, location, industry);

        res.status(200).json({ estimatedSalary });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

