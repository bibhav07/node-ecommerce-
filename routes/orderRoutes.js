const  {createOrder, getCurrentUserOrder, getSingleOrder, getAllOrders, deleteOrder, updateOrder}  = require("../controllers/orderController");
const  { authenciateUser, authorizePermissions   }  = require("../middleware/authentication");

const router  = require("express").Router();

router
  .route('/')
  .post(authenciateUser, createOrder)
  .get(authenciateUser, authorizePermissions('admin'), getAllOrders);


router.route("/showAllMyOrders").get(authenciateUser, getCurrentUserOrder);

router.route("/:id").patch(authenciateUser, updateOrder).get(authenciateUser, getSingleOrder).delete(authenciateUser, deleteOrder);


module.exports = router;

