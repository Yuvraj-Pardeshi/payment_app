import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://yuvraj:Yuvraj2002@user-auth.oj1us.mongodb.net/paytm')

const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        lowercase : true,
        minlength : 3,
        maxlength : 30
    },
    lastName : {
        type : String,
        required : true,
        lowercase : true,
        minlength : 3,
        maxlength : 30
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    }
})

const accountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

export const Account = mongoose.model("Account",accountSchema);

export const Users = mongoose.model("Users",UserSchema);
