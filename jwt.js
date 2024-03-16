const jwt=require('jsonwebtoken');

require('dotenv').config();

const jwtAuthmiddleware=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error:'unauthorised'});
    try{
        const decoded=await jwt.verify(token,process.env.JWT_KEY);
        req.user=decoded;
        next();

    }catch(err){
        console.log(err);
        res.status(401).json({error:"invalid token"});
    }
}




const generateToken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_KEY);
}

module.exports={jwtAuthmiddleware,generateToken};