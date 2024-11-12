const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee');
const path = require('path');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg and .png files are allowed'));
        }
    }
});


const validateEmployee = [
    check('f_Name').notEmpty().withMessage('Name is required'),
    check('f_Email')
        .isEmail().withMessage('Invalid email format')
        .custom(async (email, { req }) => {
            const employee = await Employee.findOne({ f_Email: email });
            if (employee && employee._id.toString() !== req.params.id) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    check('f_Mobile').isNumeric().withMessage('Mobile number must be numeric'),
    check('f_Designation').notEmpty().withMessage('Designation is required'),
    check('f_Course').notEmpty().withMessage('At least one course is required')
];


router.post('/', upload.single('f_Image'), validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const employeeData = {
            ...req.body,
            f_Image: req.file ? req.file.filename : null,
            f_Course: req.body.f_Course.split(',')
        };
        
        const employee = new Employee(employeeData);
        await employee.save();
        res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Error creating employee' });
    }
});


router.put('/:id', upload.single('f_Image'), validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const updatedData = {
            ...req.body,
            f_Image: req.file ? req.file.filename : null,
            f_Course: req.body.f_Course.split(',')
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Error updating employee' });
    }
});


router.put('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee status updated successfully', employee });
    } catch (error) {
        console.error('Error updating employee status:', error);
        res.status(500).json({ message: 'Error updating employee status', error });
    }
});



router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 6, search = '', sortBy = 'f_Name', sortOrder = 'asc' } = req.query;
        const searchQuery = {
            $or: [
                { f_Name: { $regex: search, $options: 'i' } },
                { f_Email: { $regex: search, $options: 'i' } },
                { f_Designation: { $regex: search, $options: 'i' } },
            ],
        };

        const employees = await Employee.find(searchQuery)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalEmployees = await Employee.countDocuments(searchQuery);
        res.status(200).json({ employees, totalEmployees });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

module.exports = router;
