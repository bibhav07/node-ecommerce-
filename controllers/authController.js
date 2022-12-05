const User = require("../models/User");
const {  StatusCodes  } = require("http-status-codes");
const CustomError = require("../errors");
const jwt  = require("jsonwebtoken");
const { attactCookiesToResponse, createTokenUser } = require("../utils");

const register  = async (req, res) => {
    const {email, name, password}  = req.body;

    const emailAlreadyExists = await User.findOne({email});

    if(emailAlreadyExists){
        throw new CustomError.BadRequestError("Email already exists");
    }

    //is first account
    const isFirstAccount = await User.countDocuments({})  === 0;

    role = isFirstAccount ? "admin" : "user";

    const user  = await User.create({ name, email, password, role  });
    
    const tokenUser = createTokenUser({ user })


    await attactCookiesToResponse( {  res, user: tokenUser }  );

    res.status(StatusCodes.CREATED).json({ user : tokenUser  });


}


const login  =async (req, res) => {

    const { email , password}   = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError("Email and password required to login")
    }

    const user  = await User.findOne({ email  });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }


    const isPasswordCorrect  =  await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }

    const tokenUser = createTokenUser({user});
    await attactCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.OK).json({ user : tokenUser  });
}


const logout  = (req, res) => {

    res.cookie('token',  'logout',  {
        httpOnly: true, 
        expires: new Date(Date.now()  + 1000),
    }     )
   res.status(StatusCodes.OK).json({ msg : "user logged out!!!"  })
}


module.exports  = {  register, login, logout }