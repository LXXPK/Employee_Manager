import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../styles/EmployeeList.css';
import Navbar from '../components/Navbar';

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('f_Name');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchEmployees = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/employees', {
                params: { page, search, sortBy, sortOrder },
            });
            setEmployees(data.employees);
            setTotalCount(data.totalEmployees);
        } catch (error) {
            console.error('Error fetching employees', error);
        }
    }, [page, search, sortBy, sortOrder]);

    const toggleStatus = async (id, isActive) => {
        try {
            await axios.put(`http://localhost:5000/api/employees/status/${id}`, { isActive });
            fetchEmployees(); 
        } catch (error) {
            console.error('Error toggling status', error);
        }
    };

    const deleteEmployee = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/employees/${id}`);
                fetchEmployees(); 
            } catch (error) {
                console.error('Error deleting employee', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/employees/edit/${id}`);
    };

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleSortChange = (field) => {
        setSortBy(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <Navbar/>
        <div className="employee-list-container">
            <h2>Employee List</h2>

            <div className="search-container">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by Name, Email, or Designation"
                    className="search-bar"
                />
            </div>

            <div className="sort-buttons">
                <button onClick={() => handleSortChange('f_Name')}>Sort by Name</button>
                <button onClick={() => handleSortChange('f_Email')}>Sort by Email</button>
                <button onClick={() => handleSortChange('f_Id')}>Sort by ID</button>
            </div>

            <p className='count'>Total Employees: {totalCount}</p>

            <button className="add-employee-btn" onClick={() => navigate('/employees/add')}>
                Add Employee
            </button>

            <table className="employee-table">
                <thead>
                    <tr>
                        
                        <th><center>ID</center></th>
                        <th><center>Profile</center></th>
                        <th><center>Name</center></th>
                        <th><center>Email</center></th>
                        <th><center>Designation</center></th>
                        <th><center>Create Date</center></th>
                        <th><center>Status</center></th>
                        <th><center>Actions</center></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee._id}>
                            <td><center>{employee.f_Id}</center></td>
                            <td><center>
                                {employee.f_Image ? (
                                    <img
                                        src={`http://localhost:5000/uploads/${employee.f_Image}`}
                                        alt={`${employee.f_Name}'s Profile`}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                ) : (
                                    'No Image'
                                )}
                                </center>
                            </td>
                            <td><center>{employee.f_Name}</center></td>
                            <td><center>{employee.f_Email}</center></td>
                            <td><center>{employee.f_Designation}</center></td>
                            <td>{new Date(employee.f_Createdate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</td>
                            <td>
                            <center>
                            <button
                                onClick={() => toggleStatus(employee._id, !employee.isActive)}
                                className={employee.isActive ? 'status-toggle-btn-active' : 'status-toggle-btn-deactivated'}
                            >
                               {employee.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            </center> 


                            </td>
                            <td>
                                <center>
                                <button className='edit' onClick={() => handleEdit(employee._id)}>Edit</button><br/>
                                <button  className='delete' onClick={() => deleteEmployee(employee._id)}>Delete</button>
                                </center>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-controls">
                <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Previous</button>
                <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(totalCount / 6)}>Next</button>
            </div>
        </div>
        </div>
    );
};

export default EmployeeList;
