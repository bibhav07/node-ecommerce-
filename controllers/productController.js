const Product  = require("../models/Product");
const CustomError  = require("../errors");

const { StatusCodes  } = require("http-status-codes");

const path  = require("path");

const createProduct  =  async(req, res)  => {

    req.body.user = req.user.userId;
    const product  = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({  product  });

};




const getAllProducts  = async (req, res)  => {

    const products  = await Product.find({}).populate("reviews");
    res.status(StatusCodes.OK).json({products,  count : products.length});


};


const getSingleProduct  = async (req, res)  => {

    const {id  : productId}  = req.params;

    const product  = await Product.findOne({  _id : productId }).populate({
        path: 'user',
        select: 'name role',
    });

    if(!product){
        throw new CustomError.BadRequestError(`No product found with id : ${productId}`);
    }


    res.status(StatusCodes.OK).json({  product  })

};


const updateProduct  =  async(req, res)  => {
    const { id : producId} = req.params;

    const product = await Product.findOneAndUpdate(
        { _id: producId },   
        req.body,   
        {  new : true,   runValidators : true }        );

    if(!product){
        throw new CustomError.BadRequestError(`No product found with id : ${producId}`);
    }

    res.status(StatusCodes.OK).json({  product  })

};

const deleteProduct  =  async(req, res)  => {
    const { id : producId} = req.params;

    const product   = await Product.findOne({ _id : producId  });

    if(!product){
        throw new CustomError.BadRequestError(`No product found with id : ${producId}`);
    }

    await product.remove();

    res.status(StatusCodes.OK).json({  msg : "success"  })

};

const uploadImage  = async (req, res)  => {
    
    if(!req.files){
        throw new CustomError.BadRequestError("Please provide an image");
    };

    const productImage  = req.files.image;

    if(!productImage.mimetype.startsWith("image")){
        throw new CustomError.BadRequestError("Please provide an image");

    };


    const maxSize = 1042 * 1024;

    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError("Please upload image smaller than 1mb");

    };


    const imagePath  = path.join(__dirname,  "../public/uploads/"  +    `${productImage.name }`);
    
    await productImage.mv(imagePath);

    res.status(StatusCodes.OK).json({  image : `/uploads/${productImage.name}`  })

};

module.exports  = {  createProduct, getAllProducts, getSingleProduct, deleteProduct, updateProduct, uploadImage  };


