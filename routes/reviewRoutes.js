const router  =  require("express").Router();


const { createReview, getAllReview, getSingleReview, updateReview, deleteReview } = require("../controllers/ReviewController");
const { authenciateUser, authorizePermissions } = require("../middleware/authentication");

router.route("/")
.post([authenciateUser,authorizePermissions("admin", "user") ],  createReview)
.get(getAllReview);

router.route("/:id")
.get(getSingleReview)
.patch([authenciateUser,authorizePermissions("admin", "user") ], updateReview)
.delete([authenciateUser,authorizePermissions("admin", "user") ], deleteReview);

module.exports  =   router;