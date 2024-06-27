const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

let refreshTokens = [];

const authController = {
  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: '24h' }
    );
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: '365d' }
    );
  },

  //REGISTER
  registerUser: async (req, res) => {
    try {
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newMember = await new Member({
        username: req.body.username,
        password: hashed,
        name: req.body.name,
      });

      //Save user to DB
      const user = await newMember.save();
      return res.status(200).json({
        message: 'Register successfully',
        httpStatus: 'OK',
        timeStamp: new Date(),
        data: user,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const member = await Member.findOne({ username: req.body.username });
      if (!member) {
        return res.status(404).json({
          message: 'Incorrect username',
          httpStatus: 'NOT_FOUND',
          timeStamp: new Date(),
          data: null,
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        member.password
      );
      if (!validPassword) {
        return res.status(400).json({
          message: 'Incorrect password',
          httpStatus: 'BAD_REQUEST',
          timeStamp: new Date(),
          data: null,
        });
      }
      if (member && validPassword) {
        //Generate access token
        const accessToken = authController.generateAccessToken(member);
        //Generate refresh token
        const refreshToken = authController.generateRefreshToken(member);
        refreshTokens.push(refreshToken);
        //STORE REFRESH TOKEN IN COOKIE
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });

        // const { password, ...others } = member._doc;
        return res.status(200).json({
          message: 'Login successful',
          httpStatus: 'OK',
          timeStamp: new Date(),
          data: {
            accessToken,
            refreshToken,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: 'Internal server error',
        httpStatus: 'INTERNAL_SERVER_ERROR',
        timeStamp: new Date(),
        data: null,
      });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      // Lấy token từ header Authorization
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
      if (!token) {
        return res.status(401).json({
          message: 'Unauthorized: No token provided',
          httpStatus: 'UNAUTHORIZED',
          timeStamp: new Date(),
          data: null,
        });
      }

      // Xác thực token
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

        // Tìm user trong database
        const user = await Member.findById(decoded.id);

        if (!user) {
          return res.status(404).json({
            message: 'User not found',
            httpStatus: 'NOT_FOUND',
            timeStamp: new Date(),
            data: null,
          });
        }

        const authUser = {
          id: user._id,
          name: user.name,
          dob: user.dob,
          username: user.username,
          isAdmin: user.isAdmin,
          profilePic: user.profilePic,
        };

        return res.status(200).json({
          message: 'User information retrieved successfully',
          httpStatus: 'OK',
          timeStamp: new Date(),
          data: authUser,
        });
      } catch (jwtError) {
        return res.status(403).json({
          message: 'Forbidden: Invalid token',
          httpStatus: 'FORBIDDEN',
          timeStamp: new Date(),
          data: null,
        });
      }
    } catch (err) {
      console.error('Error in getCurrentUser:', err);
      return res.status(500).json({
        message: 'Internal server error',
        httpStatus: 'INTERNAL_SERVER_ERROR',
        timeStamp: new Date(),
        data: null,
      });
    }
  },

  // REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Refresh token is not valid');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  //LOG OUT
  logOut: async (req, res) => {
    try {
      //Clear cookies when user logs out
      refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
      res.clearCookie('refreshToken');
      return res.status(200).json('Logged out successfully!');
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        httpStatus: 'INTERNAL_SERVER_ERROR',
        timeStamp: new Date(),
        data: null,
      });
    }
  },
};

module.exports = authController;
