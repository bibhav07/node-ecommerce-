const router  = require("express").Router();

const {    getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword  }
= require("../controllers/userController");
const { authenciateUser, authorizePermissions } = require("../middleware/authentication");



router.route("/").get(authenciateUser, authorizePermissions("admin"), getAllUsers);

router.route("/showMe").get(authenciateUser, showCurrentUser);

router.route("/updateUser").patch(authenciateUser, updateUser);
router.route("/updateUserPassword").patch(authenciateUser, updateUserPassword);

router.route("/:id").get([authenciateUser],getSingleUser);


module.exports  = router;

//7