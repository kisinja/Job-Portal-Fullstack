import axios from 'axios';
import { useState } from 'react';

const SignUp = () => {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];

        // Check if the file size exceeds 5MB (5 * 1024 * 1024 bytes)
        if (file && file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB. Please choose a smaller file.');
            return; // Stop further processing
        }

        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', image); // 'profilePic' should match the backend field name

        try {
            const response = await axios.post('http://localhost:7777/api/uploadPic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Image uploaded successfully:', response.data);
            // Handle success (e.g., display a success message, redirect, etc.)
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error.message);
            // Handle error (e.g., display an error message)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" name="profilePic" onChange={handleChange} />
                </div>
                <button type="submit">Upload Image</button>
            </form>

            {/* Display the uploaded image */}
            {image && (
                <div>
                    <h2>Preview:</h2>
                    <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100%' }} />
                </div>
            )}
        </div>
    );
};

export default SignUp;
