import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Task_Schema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    task_id: {
        type: String,
        required: true
    },
    task_status: {
        type: String,
        required: true
    },
    task_start_date: {
        type: String,
        required: true
    },
    task_end_date: {
        type: String,
        required: true
    },
    
    task_description: {
        type: String,
        required: true
    },

})

const User_Task_Schema = mongoose.model('User_Task', Task_Schema);
export default User_Task_Schema;
