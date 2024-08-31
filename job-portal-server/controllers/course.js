import fetch from 'node-fetch';

// suggest courses
export const suggestCourses = async (req, res) => {
    const { skills } = req.body;
    const skillQuery = skills.join(' ');

    try {
        const res = await fetch(`https://www.udemy.com/api-2.0/courses/?search=${encodeURIComponent(skillQuery)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.UDEMY_CLIENT_ID}:${process.env.UDEMY_CLIENT_SECRET}`,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            return res.status(res.status).json({ error: 'Failed to fetch courses from Udemy' })
        }

        const data = await res.json();
        res.json({ courses: data.results });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};
