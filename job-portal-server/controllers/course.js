import fetch from 'node-fetch';

// suggest courses
export const suggestCourses = async (req, res) => {
    const { skills } = req.body;

    // Validate that skills is an array of objects
    if (!Array.isArray(skills) || !skills.every(skill => skill.value)) {
        return res.status(400).json({ error: 'Invalid skills format. Must be an array of objects with a value property.' });
    }

    // Extract the skill values for the query
    const skillQuery = skills.map(skill => skill.value).join(' ');

    try {
        const response = await fetch(`https://www.udemy.com/api-2.0/courses/?search=${encodeURIComponent(skillQuery)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.UDEMY_CLIENT_ID}:${process.env.UDEMY_CLIENT_SECRET}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch courses from Udemy' });
        }

        const data = await response.json();
        res.json({ courses: data.results });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};