import asynchandler from 'express-async-handler';
//@desc auth user/set token
//route POST /api/users/auth
//@access public
const authUser=asynchandler(async(req,res)=>{
    res.status(200).json({message:'Auth user'})
});
 
//@desc Register new user
//route POST /api/users
//@access public
const registerUser=asynchandler(async(req,res)=>{
    res.status(200).json({message:'Register user'})
});


export {
    authUser
};