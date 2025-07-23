const User = require("../models/User");
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../utils/cloudinary");

// Generating JWT Access & Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Find the user by ID from the database
    const user = await User.findById(userId);

    // Generating Access & Refresh Token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Saving Refresh Token to the database
    user.refreshToken = refreshToken;
    // "validateBeforeSave: false": This option is used to bypass the validation process when saving the user document. By default, Mongoose performs validation checks before saving a document. However, in this case, we want to bypass these checks because we are updating the user's refreshToken field without modifying other fields.
    await user.save({ validateBeforeSave: false });

    // Returning the access and refresh tokens because we will use them in the frontend
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validation Checking for Missing Fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All Fields are Required!" });
  }

  try {
    // Checking If the email already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already in Use" });
    }

    let profileImageUrl = "";

    const profileImageLocalPath = req.file?.path;
    if (profileImageLocalPath) {
      const uploadResult = await uploadOnCloudinary(profileImageLocalPath);

      if (!uploadResult) {
        return res
          .status(400)
          .json({ message: "Failed to upload profile image" });
      }

      profileImageUrl = uploadResult.secure_url;
    }

    // Creating the User
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // Checking if the user is created or not
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Checking if the user is created or not
    if (!createdUser) {
      return res.status(500).json({ message: "Error Creating User" });
    }

    // Returning the response to the client
    return res.status(201).json({
      message: "User Registered Successfully",
      data: createdUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Registering User", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generating the access and refresh token for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Fetching the logged in user again and explicitly excluding the password and refreshToken from the response. This is a good security practice to not send sensitive fields to frontend.
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // httpOnly: Prevents frontend JS from accessing cookie (protects from XSS).
    // secure: Sends cookie only over HTTPS (won’t work on localhost unless using https).
    const options = {
      httpOnly: true,
      // secure: true,   // Uncomment this line when deploying to production
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User Logged In Successfully",
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
      });
  } catch (err) {
    res.status(500).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    // secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully", data: null });
};

exports.refreshAccessToken = async (req, res) => {
  // Getting the refresh token from the cookies or the request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // If the refresh token is not present in the cookies or the request body, return an error
  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    // We are verifying the refresh token here and getting the user id from it.
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Finding the user using the decoded token's id.
    // Retrieves the user from the database using the _id extracted from the decoded token.
    const user = await User.findById(decodedToken?._id);

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    // If the refresh token is not the same as the one stored in the database, return an error
    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }

    const options = {
      httpOnly: true,
      // secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access Token Refreshed Successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
  } catch (err) {
    res.status(500).json({
      message: "Error refreshing access token",
      error: err.message,
    });
  }
};

// UserInfo
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Taking Users Info", error: err.message });
  }
};
