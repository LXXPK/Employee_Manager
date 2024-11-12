import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./../styles/EditEmployee.css";  
import Navbar from './Navbar';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_Gender: '',
        f_Course: [],
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { options } = e.target;
        const selectedCourses = Array.from(options).filter(option => option.selected).map(option => option.value);
        setEmployee((prevData) => ({ ...prevData, f_Course: selectedCourses }));
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
        if (!employee.f_Name) newErrors.f_Name = 'Name is required';
        if (!employee.f_Email) newErrors.f_Email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(employee.f_Email)) newErrors.f_Email = 'Invalid email format';
        if (!employee.f_Mobile) newErrors.f_Mobile = 'Mobile is required';
        else if (!/^\d+$/.test(employee.f_Mobile)) newErrors.f_Mobile = 'Mobile must be numeric';
        if (!employee.f_Designation) newErrors.f_Designation = 'Designation is required';
        if (!employee.f_Gender) newErrors.f_Gender = 'Gender is required';
        if (!employee.f_Course.length) newErrors.f_Course = 'At least one course is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            Object.keys(employee).forEach((key) => formData.append(key, employee[key]));
            if (image) formData.append('f_Image', image);

            await axios.put(`http://localhost:5000/api/employees/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Employee updated successfully');
            navigate('/employees');
        } catch (error) {
            alert('Failed to update employee');
        }
    };

    return (
        <div>
            <Navbar/>
        
        <div className="edit-employee-container"> {/* Apply container class */}
            <h2>Edit Employee</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="f_Name" value={employee.f_Name} onChange={handleChange} />
                    {errors.f_Name && <span>{errors.f_Name}</span>}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="f_Email" value={employee.f_Email} onChange={handleChange} />
                    {errors.f_Email && <span>{errors.f_Email}</span>}
                </div>
                <div className="form-group">
                    <label>Mobile:</label>
                    <input type="text" name="f_Mobile" value={employee.f_Mobile} onChange={handleChange} />
                    {errors.f_Mobile && <span>{errors.f_Mobile}</span>}
                </div>
                <div className="form-group">
                    <label>Designation:</label>
                    <select name="f_Designation" value={employee.f_Designation} onChange={handleChange}>
                        <option value="">Select Designation</option>
                        <option value="Developer">Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Analyst">Analyst</option>
                    </select>
                    {errors.f_Designation && <span>{errors.f_Designation}</span>}
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <select name="f_Gender" value={employee.f_Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.f_Gender && <span>{errors.f_Gender}</span>}
                </div>
                <div className="form-group">
                    <label>Course:</label>
                    <select name="f_Course" multiple value={employee.f_Course} onChange={handleCourseChange}>
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
                <button type="submit">Update Employee</button>
            </form>
        </div>
        </div>
    );
};

export default EditEmployee;
