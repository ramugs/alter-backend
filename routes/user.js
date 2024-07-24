const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  removeImages,
  updateImages,
  updateProfileImages,
} = require("../controllers/user");
const router = express.Router();

router.route("/").post(createUser);
router.route("/:id").get(getUser).patch(updateUser);
router.route("/remove-image/:id").patch(removeImages);
router.route("/update-image/:id").patch(updateImages);
router.route("/profile-image/:id").patch(updateProfileImages);

module.exports = router;
