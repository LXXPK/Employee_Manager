import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EditEmployee from './components/EditEmployee';
import AddEmployee from './pages/AddEmployee';
import Logout from './components/Logout';
import Initial from "./pages/Initial";
import Register from './components/Register';

const App = () => {
    return (
        
        <Router>
            
            <Routes>
                <Route path="/" element={<Initial />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/edit/:id" element={<EditEmployee />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/logout" element={<Logout />} />
              
            </Routes>
        </Router>
    );
};

export default App;
