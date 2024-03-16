const express=require('express');

const router=express.Router();

const Candidate=require('../models/candidate');
const {jwtAuthmiddleware,generateToken}=require('../jwt');



router.post('/candidates',jwtAuthmiddleware,async(req,res)=>{
    if(req.user.role!='admin')
    {
        console.log("you are not admin");
        return res.status(403).json({response:"you are not authorized"});
    }
    try{
       const data=req.body;

       const newcandidate=new Candidate(data);
       
       const response=await newcandidate.save();

       console.log('candidate added successfully');

       res.status(200).json(response);

    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})


router.put('/candidates/:candidateId',jwtAuthmiddleware,async(req,res)=>{
    if(req.user.role!='admin')
    {
        console.log("you are not admin");
        return res.status(403).json({response:"you are not authorized"});
    }
    try{
      
        const candidateId=req.params.candidateId;
        const updatedCandidate=req.body;
        
        const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidate,{ new: true });
       
        console.log('update successfully');

       res.status(200).json(response);


    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

router.delete('/candidates/:candidateId',jwtAuthmiddleware,async(req,res)=>{
    if(req.user.role!='admin')
    {
        console.log('you are not admin');
        return res.status(403).json({response:"you are not authorized"});

    }
    try{
      
        const candidateId=req.params.candidateId;
        
        const response=await Candidate.findByIdAndDelete(candidateId);
       
        console.log('update successfully');

        
       res.status(200).json(response);


    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }

})


module.exports=router;