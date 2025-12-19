import { success } from "zod";
import User from "../models/User";
import Admin from "../models/Admin";
import { RegisterInput } from "../shared/validation/user.validation";
// import bcrypt from "bcryptjs";

export const registerOperation = async (data: RegisterInput) => {
  const { name, email, password } = data;

  const exists = await User.findOne({ email });
  if (exists) {
    return { success: false, message: "Email already exists" };
  }


  const user = await User.create({
    name,
    email,
    password
  });

  return { success: true, user };
};

// login

export const loginOperation =async({email,password}:{email:string;password:string})=>{

    let user=await User.findOne({email});

   
    
    if(!user)
    return{success:false, message:"user not found"};
    
// 2
 // Try finding user in User table
  // let user: any = await User.findOne({ email });

  // If not found → check Admin table
  // if (!user) {
  //   user = await Admin.findOne({ email });
  //   if (!user) {
  //     return { success: false, message: "User not found" };
  //   }
  // }
  // const role = user instanceof Admin ? "admin" : "user";


    if(user.password !== password) return {success:false, message:"invalid"};
      return{
        success:true,
        // role,
        user:
        {
          _id:user._id,
          name:user.name,
          email:user.email,
        },
        token:"dummy-token;"
      }

      



    };

  