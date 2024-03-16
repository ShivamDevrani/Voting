const mongoose=require('mongoose');

const bcrypt=require('bcrypt');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    age:{
       type:Number,
       required:true
    },
    email:{
        type:String,
        
    },
    mobile:{
        type:String,
        
    },
    address:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:String,
        required:true,
        unique:true
     },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }

});

//adding hashing and salting to the password

userSchema.pre('save',async function(next){

   const user=this;

   if(!user.isModified('password'))
   {
       return next();
    }

   try{
      const salt=await bcrypt.genSalt(10);

      const hashpassword=await bcrypt.hash(user.password,salt);

      user.password=hashpassword;
     
      next();

   }catch(err){
        return next(err);
   }

})


userSchema.methods.comparePassword=async function(userPassword){
    try{
        const ismatch=await bcrypt.compare(userPassword,this.password);
        return ismatch;

    }catch(err){
        throw err;
    }
}



const User=mongoose.model('User',userSchema);
module.exports=User;
