import express from 'express'
import z from 'zod'
import {Users, Account} from '../db.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware.js'
import JWT_SECRET from '../config.js';

const router = express.Router();

const signupSchema = z.object({
    firstName : z.string().min(3).max(30),
    lastName : z.string().min(3).max(30),
    email : z.string().email('Invalid email formate'),
    password : z.string().min(6,"password must be at least of 6 char")
})
const signinSchema = z.object({
    email : z.string().email('Invalid email formate'),
    password : z.string().min(6,"password must be at least of 6 char")
})
 router.post("/signup",async (req,res)=>{
    const response = req.body;
    const {success} = signupSchema.safeParse(response);
    if(!success){
        res.json({
            "msg" : "invalid input formate"
        })
    }
    const existUser = await Users.findOne({email : response.email})
    if(existUser){
        return res.status(400).json({
            "msg" : "Email already exist"
        })
    }

    const newuser = await Users.create({
        firstName : response.firstName,
        lastName : response.lastName,
        email : response.email,
        password : response.password
    })

    const userId = newuser._id

    // create new account
    await Account.create({
        userId,
        balance : 1 + Math.random() * 10000
    })

    res.json({
        'msg' : 'User created successfully'
    })
 })

 router.post("/signin",async(req,res)=>{
    const response = req.body
    const {success} = signinSchema.safeParse(response);
    if(!success){
        res.json({
            'msg' : 'Invalid credential'
        })
    }
    const existUser = await Users.findOne({email : response.email, password : response.password});

    if(existUser){
        const userID = existUser._id
        const token = jwt.sign({user_id : userID}, JWT_SECRET);
        res.json({
            'msg' : 'Valid User',
            'token' : token
        })
    }
    else{
        res.json({
            'msg' : 'Invalid user'
        })
    }
 })

 const updateBody = z.object({
    password : z.string().min(6),
    firstName : z.string().optional(),
    lastName : z.string().optional()
 })
router.put("/",authMiddleware,async (req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({'msg' : 'Error while updating user'});
    }
    await Users.updateOne(req.body,{
        id : req.userId
    })

    res.json({'msg' : 'User updated successfully'})
})

router.get("/bulk",async (req,res)=>{
    const filter = req.query.filter || "";
    const users = await Users.find({
        $or : [{
            firstName : {
                "$regex" : filter
            }
        },{
            lastName : {
                "$regex" : filter
            }
        }
    ]
    })

    res.json({
        user : users.map(user =>( {
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
})

export default router; 