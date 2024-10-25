import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register controller
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exits",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//login controller
export const login = async (req, res) => {
  try {
    //getting data from input
    const { email, password, role } = req.body;
    //validating data
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    //checking user is available with their email or not
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    //matching password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email and password",
        success: false,
      });
    }
    //checking user role whether user is admin or normal user
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exit with current role",
        success: false,
      });
    }

    //accessing userid for creating token
    const tokenData = {
      userId: user._id,
    };

    //creating token and their expiry
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d"
    });

    //validating userdata
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    //returning success if user is login

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,//one day expiry logic
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `WElcome back ${user.fullname}`,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout controller
export const logout = async (req, res) => {
  try {
    //clearing sessions and cookies from browser and make user signout
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//update profile controller
export const updateProfile = async (req, res) => {
  try {
    //accessing data
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

   

    //cloudinary
//converting skills type string to array
    let skillsArray;
    if(skills){
      skillsArray = skills.split(",");
    }

    
    
    const userId = req.id; //middleware authentication

    //find user by id
    let user = await User.findById(userId);

    //validating user
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    //updating data
    if(fullname) user.fullname = fullname
    if(email) user.email = email
    if(phoneNumber) user.phoneNumber = phoneNumber
    if(bio) user.profile.bio = profile.bio
    if(skills) user.profile.skills = skillsArray

    // resume
    //save updated user
    await user.save();

    //create new update user
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    //return user
    return res.status(200).json({
      message: "Profile update successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
