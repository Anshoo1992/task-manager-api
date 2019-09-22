const mongoose = require('mongoose');
const validator = require('validator');

//Model creation 

const Tasks = mongoose.model('Tasks',{
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }
});
module.exports = Tasks;