const CustomError  = require("../errors");
const {  StatusCodes }  = require("http-status-codes");
const { isTokenValid } = require("../utils");


const authenciateUser = async (req, res, next)  => {

    const token = req.signedCookies.token;

    if(!token){
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    
    try{

        const {name, userId, role}  = await isTokenValid({ token   });
        
        req.user  = {
            name,
            userId,
            role
        }

        next();
        
    }catch(error){
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    // next();



};



const authorizePermissions = (...roles) => {
    
    return (req, res, next) => {

            if(!roles.includes(req.user.role)){
                throw new CustomError.Unauthroized("Unathorized to access this route")
            }

            next();

    }

}


module.exports  = {  authenciateUser, authorizePermissions  };






