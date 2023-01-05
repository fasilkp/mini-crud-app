import mongoose from 'mongoose'
const AdminSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
 });
const AdminModel = mongoose.model('admins', AdminSchema);

export default AdminModel