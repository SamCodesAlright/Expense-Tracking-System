const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ message: "Not Autorized, No Token" });

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not Authorized, User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not Authorized, Token Failed" });
  }
};
