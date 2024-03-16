const express= require('express');

const router=express.Router();

const User=require('../models/User');
const Candidate=require('../models/candidate');

const {jwtAuthmiddleware,generateToken}=require('../jwt');



//user authentication
router.post('/signup',async (req,res)=>{
      try{
        const data=req.body;
        //another user after admin cannot enter as admin
        if(data.role==='admin')
        {
            const findadmin=await User.findOne({role:'admin'});
            if(findadmin)
            return res.json({response:"you are not authorised to be admin"});
        }

        const newuser=new User(data);

        
        const response=await newuser.save();

        const payload={
             id:response.id,
             age:response.age,
             role:response.role
        }
        const token=generateToken(payload);
        console.log("signup successfully");
        res.status(200).json({response:response,token:token});

      }
      catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
      }
})



router.post('/login',async (req,res)=>{

    const {aadharNumber,password}=req.body;

    try{

      const user=await User.findOne({aadharNumber:aadharNumber});
      if(!user)
      return res.status(401).json({error:'wrong username'});
      
      const iscompare= user.comparePassword(password);

      if(!iscompare) return res.status(401).json({error:'wrong password'});

        const payload={
            id:user.id,
            age:user.age,
            role:user.role
       }
     
       const token=generateToken(payload);
       console.log('login successfully');

       res.status(200).json({token:token});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

// user profile

router.get('/profile',jwtAuthmiddleware, async (req,res)=>{

    const userId=req.user.id;
    try{
        
       const user=await User.findById(userId);
       console.log('id fetched');
       res.status(200).json(user);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

router.put('/profile/password',jwtAuthmiddleware,async (req,res)=>{

    const userId=req.user.id;
    try{
        const {currentPassword,newPassword}=req.body;

        const user=await User.findById(userId);
        
        const ismatch=user.comparePassword(currentPassword);

        if(!ismatch) return res.status(400).json({error:'current password is incorrect'});
        
        user.password=newPassword;

        await user.save();
        
        res.status(200).json({repsonse:"successfully updated"});

    }catch(err){
         console.log(err);
         res.status(500).json({error:"internal server error"});
    }
    

})


//candidates

router.get('/candidates',jwtAuthmiddleware,async (req,res)=>{
    
    try{

        const data = await Candidate.find().select('id name age party');
        res.status(200).json(data);
        
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})


router.put('/candidates/:candidateId',jwtAuthmiddleware,async (req,res)=>{

    if(req.user.role!='voter')
    {
        return res.status(403).json({ response: "Unauthorized - Only users can vote" });

    }
    
    try{
        const user=await User.findById(req.user.id);
        if(user.isVoted)
        return res.json("already voted");

        const candidateId=req.params.candidateId;
        const data=await Candidate.findByIdAndUpdate(candidateId,{
            $push:{
                votes:{
                    user:user.id,
                    votedAt:new Date()
                }
            },
            $inc:{
                voteCount:1
            }
           
        },
        {new: true } // Return the updated document
        );
        
        // Update the user's isVoted property after voting
        await User.findByIdAndUpdate(req.user.id, { isVoted: true });
        
        console.log(data);
        res.status(200).json({response:"voted successfully"});
    }catch(err){
       console.log(err);
       res.status(500).json({error:"internal server error"});

    }
})

//show votes

router.get('/vote/counts',async (req,res)=>{
    try{
        const data=await Candidate.find().select('name party age voteCount');

        data.sort((a,b)=>b.voteCount- a.voteCount);

        res.status(200).json(data);

    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'});
    }

})


module.exports=router;