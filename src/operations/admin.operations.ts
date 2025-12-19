import { success } from "zod";
import Admin from "../models/Admin";
import User from "../models/User"
import { AdminRegisterInput } from "../shared/validation/admin.validation";
// import bcrypt from "bcryptjs";

export const adminRegisterOperation = async (data: AdminRegisterInput) => {
  const { name, email, password } = data;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return { success: false, message: "Email already exists" };
  }
// check if the email is used for user login
const valid = await User.findOne({ email });
  if (valid) {
    return { success: false, message: "Email already exists as a user" };
  }

  const admin = await Admin.create({
    name,
    email,
    password
  });

  return { success: true, admin };
};

// login

export const adminLoginOperation =async({email,password}:{email:string;password:string})=>{

    const admin=await Admin.findOne({email});

    if(!admin)
    return{success:false, message:"admin not found"};

    if(admin.password !== password) return {success:false, message:"invalid"};
      return{
        success:true,
        admin:
        {
          _id:admin._id,
          name:admin.name,
          email:admin.email,
        },
        token:"dummy-token;"
      }
      


    };

  