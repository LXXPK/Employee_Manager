const mongoose = require('mongoose');
const Counter = require('./Counter'); 
const employeeSchema = new mongoose.Schema({
    f_Id: { 
        type: String, 
        unique: true 
    },
    f_Name: { type: String, required: true },
    f_Email: { type: String, required: true },
    f_Mobile: { type: String, required: true },
    f_Designation: { 
        type: String, 
        required: true,
        enum: ['Developer', 'Manager', 'Analyst'], 
    },
    f_Gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female', 'Other'], 
    },
    f_Course: { 
        type: [String], 
        required: true,
        enum: ['Computer Science', 'Information Technology', 'Electrical Engineering'], 
    },
    f_Image: { type: String },
    isActive: { type: Boolean, default: true },
    f_Createdate: { type: Date, default: Date.now }
});


employeeSchema.pre('save', async function(next) {
    const employee = this;
    
    if (employee.isNew) {
        try {
           
            const counter = await Counter.findOneAndUpdate(
                { _id: 'employeeId' }, 
                { $inc: { sequence_value: 1 } }, 
                { new: true, upsert: true }
            );
            
            
            employee.f_Id = `EMP-${counter.sequence_value}`;
            
            next();
        } catch (error) {
            next(error); 
        }
    } else {
        next(); 
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
