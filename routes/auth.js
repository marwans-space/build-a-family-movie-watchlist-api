import express from 'express';
import { findByUsername } from '../utils/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();
export default router;
router.post('/login',async (req,res)=>{
    const {username, password} = req.body;
    if(!username || !password){
       return res.status(400).json({error:"Invalid credentials"})
    };
    const user = findByUsername(username);
    if(!user){
        return res.status(401).json({error:"User not found"});
    };
    const isValidPassword = await bcrypt.compare(password,user.passwordHash);
    if(!isValidPassword){
        return res.status(401).json({error:'Invalid credentials'});
    };
    const {id,name,role} = user;
   const token = jwt.sign({ username, id, name, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({message:'Login successful',token})
})