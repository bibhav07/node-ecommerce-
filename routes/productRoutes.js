const router  = require("express").Router();
const {  createProduct, getAllProducts, getSingleProduct, deleteProduct, updateProduct, uploadImage  }= require("../controllers/productController");
const { authenciateUser, authorizePermissions } = require("../middleware/authentication");


router.route("/")
.post([authenciateUser,authorizePermissions("admin") ],createProduct)
.get(getAllProducts);

router.route("/uplodImage")
.post([authenciateUser,authorizePermissions("admin") ],uploadImage);

router.route("/:id")
.get(getSingleProduct)
.patch([authenciateUser,authorizePermissions("admin") ],updateProduct)
.delete([authenciateUser,authorizePermissions("admin") ],deleteProduct);


module.exports  = router;



