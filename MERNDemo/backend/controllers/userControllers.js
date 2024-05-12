import asynHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModels.js';
//Auth user/set token
//route POST /api/users/auth
//@access Public
const authUser=asynHandler(async(req,res)=>{
//    res.status(401);
  //  throw new Error('Something went wrong');
    const {email,password}=req.body
    const user=await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);
        res.status(201).json({
            //201 means successful
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }else{
        res.status(400); //invalid data
        throw new Error('Invalid email or password');
    }
    //res.status(200).json({message:'Auth User'})
});
//@desc Register New User
//route POST /api/users
//@access Public
const registerUser=asynHandler(async(req,res)=>{
    //console.log(req.body);
    const {name,email,password}=req.body;
//    console.log(name);
    const userExist=await User.findOne({email:email});
    if(userExist){
        res.status(400);
        throw new Error('User already exist');
    }

    const user=await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res,user._id);
        res.status(201).json({
            //201 means successful
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }else{
        res.status(400); //invalid data
        throw new Error('Invalid user data');
    }
    res.status(200).json({message:'Register User'})
});

//desc: Log Out User
//route POST /api/users/logout
//@access Public
const logOutUser=asynHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    });
    res.status(200).json({message:'User logged out'});
});


//desc: Get user Profile
//route POST /api/users/profile
//@access private
const updateUserProfile=asynHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);

    if(user){
        user.name=req.body.name || user.name;
        user.email=req.body.email || user.email;
        
        if(req.body.password){
            user.password=req.body.password;
        }
        const updatedUser=await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,

        })
    }
    else{
        req.status(404);
        throw new Error('User not found');
    }
    //res.status(200).json({message:'update user profile'})
});

//desc: Update user Profile
//route put /api/users/profile
//@access Public
const getUserProfile=asynHandler(async(req,res)=>{
    const user={
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email
    }
    // res.status(401);
    // res.status(200).json({message:'user Profile'})
     res.status(200).json(user)
});

export {authUser,
    registerUser,
    logOutUser,
    getUserProfile,
    updateUserProfile
};
