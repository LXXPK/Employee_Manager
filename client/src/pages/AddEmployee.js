import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./../styles/AddEmployee.css";  // Importing the CSS
import Navbar from '../components/Navbar';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_Gender: '',
        f_Course: [],
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { options } = e.target;
        const selectedCourses = Array.from(options).filter(option => option.selected).map(option => option.value);
        setFormData((prevData) => ({ ...prevData, f_Course: selectedCourses }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
            setErrors((prevErrors) => ({ ...prevErrors, f_Image: 'Only JPG or PNG files are allowed' }));
        } else {
            setImage(file);
            setErrors((prevErrors) => ({ ...prevErrors, f_Image: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.f_Name) newErrors.f_Name = 'Name is required';
        if (!formData.f_Email) newErrors.f_Email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.f_Email)) newErrors.f_Email = 'Invalid email format';
        if (!formData.f_Mobile) newErrors.f_Mobile = 'Mobile is required';
        else if (!/^\d+$/.test(formData.f_Mobile)) newErrors.f_Mobile = 'Mobile must be numeric';
        if (!formData.f_Designation) newErrors.f_Designation = 'Designation is required';
        if (!formData.f_Gender) newErrors.f_Gender = 'Gender is required';
        if (!formData.f_Course.length) newErrors.f_Course = 'At least one course is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (image) data.append('f_Image', image);

            await axios.post('http://localhost:5000/api/employees', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Employee added successfully');
            navigate('/employees');
        } catch (error) {
            alert('Failed to add employee');
        }
    };

    return (
        <div>
      <Navbar />
        <div className="add-employee-container"> 
            <h2>Add New Employee</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="f_Name" value={formData.f_Name} onChange={handleChange} />
                    {errors.f_Name && <span>{errors.f_Name}</span>}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="f_Email" value={formData.f_Email} onChange={handleChange} />
                    {errors.f_Email && <span>{errors.f_Email}</span>}
                </div>
                <div className="form-group">
                    <label>Mobile:</label>
                    <input type="text" name="f_Mobile" value={formData.f_Mobile} onChange={handleChange} />
                    {errors.f_Mobile && <span>{errors.f_Mobile}</span>}
                </div>
                <div className="form-group">
                    <label>Designation:</label>
                    <select name="f_Designation" value={formData.f_Designation} onChange={handleChange}>
                        <option value="">Select Designation</option>
                        <option value="Developer">Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Analyst">Analyst</option>
                    </select>
                    {errors.f_Designation && <span>{errors.f_Designation}</span>}
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <select name="f_Gender" value={formData.f_Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.f_Gender && <span>{errors.f_Gender}</span>}
                </div>
                <div className="form-group">
                    <label>Course:</label>
                    <select name="f_Course" multiple onChange={handleCourseChange}>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                    {errors.f_Course && <span>{errors.f_Course}</span>}
                </div>
                <div className="form-group">
                    <label>Photo:</label>
                    <input type="file" name="f_Image" onChange={handleImageChange} />
                    {errors.f_Image && <span>{errors.f_Image}</span>}
                </div>
                <button type="submit">Add Employee</button>
            </form>
        </div>
        </div>
    );
};

export default AddEmployee;
