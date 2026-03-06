const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const uploadOnCloudinary = require("../utils/cloudinary");

const {
  registerUser,
  loginUser,
  getUserInfo,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const uploadSingleProfileImage = (req, res, next) => {
  upload.single("profileImageUrl")(req, res, (err) => {
    if (!err) return next();

    const message = err?.message || "File upload error";
    return res.status(400).json({ message });
  });
};

router.post("/register", uploadSingleProfileImage, registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post("/logout", protect, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const response = await uploadOnCloudinary(req.file.path);
    return res.status(200).json({ profileImageUrl: response.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;
