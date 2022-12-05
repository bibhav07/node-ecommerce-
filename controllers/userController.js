const { StatusCodes }  = require("http-status-codes");
const CustomError  = require("../errors");
const  {  createTokenUser, attactCookiesToResponse, checkPermissions }  = require("../utils");

const User  = require("../models/User");

const getAllUsers  = async (req, res)  => {

        console.log("--ALL USERS");
        console.log(req.user);
        const users  = await User.find({ role : "user"}).select("-password -__v");
        res.status(StatusCodes.OK).json({   users  });

};


const getSingleUser  = async(req, res)  => {

 
    const {id}  = req.params;
    const user  = await User.findOne({ _id :  id }).select("-password -__V");

    if(!user){
        throw new CustomError.NotFoundError(`No user found with id ${id}`);
    }

    checkPermissions(req.user, user._id);

    res.status(StatusCodes.OK).json({   user  });

};



const showCurrentUser  = (req, res)  => {

    res.status(StatusCodes.OK).json({ user : req.user }); 
};

//update use with findOneAndUpdate
const updateUser  = async (req, res)  => {
    const {email, name} = req.body;

    if(!email || !name){
        throw new CustomError.BadRequestError("Please provide email and password");
    }


    const user  = await User.findOne({ _id : req.user.userId } );
    
    user.name  = name;
    user.email = email;
    
    await user.save();

    const tokenUser = createTokenUser({user});
    await attactCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.OK).json({ user : tokenUser  });

}


const updateUserPassword  = async (req, res)  => {

    const {oldPassword, newPassword}  = req.body;

    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Please provide old password and new password");
    }

    const user  = await User.findOne({ _id : req.user.userId   });

    if(!user){
        throw new CustomError.BadRequestError(`No user found with id : ${re.user.userId}`);
    }


    const isPasswordCorrect  =  await user.comparePassword(oldPassword);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json(  {  msg : "Success, password updated"  }  )


}






module.exports  = {    getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword  };


//update use with findOneAndUpdate
// const updateUser  = async (req, res)  => {
//     const {email, name} = req.body;

//     if(!email || !name){
//         throw new CustomError.BadRequestError("Please provide email and password");
//     }


//     const user  = await User.findOneAndUpdate({ _id : req.user.userId },  {  email, name },  {  new : true, runValidators : true }  );
//     const tokenUser = createTokenUser({user});
//     await attactCookiesToResponse({res, user: tokenUser});

//     res.status(StatusCodes.OK).json({ user : tokenUser  });

// }