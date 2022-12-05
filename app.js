require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB  = require("./db/connect");

//packages
const morgan = require("morgan");
const cookieParser  = require("cookie-parser");
const cors  = require("cors");
const fileUpload  = require("express-fileupload");


//middleware
const notFoundMiddlewar = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler")


//routes
const authRouter = require("./routes/authRoutes");
const userRouter  = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter  = require("./routes/reviewRoutes");
const orderRouter = require('./routes/orderRoutes');


const app = express();

const port  = process.env.PORT || 5000;


app.use(express.json()); 
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET)); //pasing the signature
app.use(cors());
app.use(express.static("./public"));
app.use(fileUpload());


app.get("/api/v1",  (req, res)  => {
    // res.json({msg : "hey working!!!", cookie : req.cookies.token  });
    res.json({msg : "hey working!!!", cookie : req.signedCookies  });
})


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddlewar);
app.use(errorHandlerMiddleware);



  
const start = async ()  => {
    try{

        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {   console.log(`app running...on port ${port}`)    })

    }catch(error){
        console.log(error)
    }
};

start();