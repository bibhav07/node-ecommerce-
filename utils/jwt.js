const jwt  = require("jsonwebtoken");



const createJWT =  async({ payload }) => {
    const token  = await jwt.sign(
        payload,  
        process.env.JWT_SECRET,  
        {  expiresIn : process.env.JWT_LIFETIME }  
    )
    return token

};

const isTokenValid = ({token})  => jwt.verify(token, process.env.JWT_SECRET);



const attactCookiesToResponse  = async ({ res, user })  => {

    const token = await createJWT({  payload : user  });

    const oneDay  = 1000 * 60 * 60 * 24;

    res.cookie('token',  token,  {
        httpOnly : true, // cookie to be accessible by websrvers
        expires  : new Date(Date.now() + oneDay),
        secure : process.env.NODE_ENV === "production", // cooke to be used wth HTTPS only
        signed : true
    })
     
}



module.exports  = { createJWT, isTokenValid , attactCookiesToResponse };