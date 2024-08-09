"use strict";

// require('dotenv').config();
var jwt = require('jsonwebtoken');
// const secretKey=process.env.SECRET

// const cookieParser=require('cookie-parser')
// app.use(cookieParser());

var verify = function verify(req, res, next) {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  try {
    var _req$cookies, _req$headers$authoriz;
    var token = ((_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies.accessToken) || ((_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace("Bearer ", ""));

    // res.send({token});
    // console.log({token});

    if (!token) {
      return res.status(400).send('Unauthorized User, No Token Found');
    }
    jwt.verify(token, 'xQJslU3ieVjhYt0xCUu8hhUGayx265KgfP4W0abHhvfJJA8xFO8cYVChPGhjz0JT4w1GP3vURXdXBk8jC2Hu4W49jz', function (err, user) {
      if (err) {
        return res.status(400).send("Unauthorized User, Token Don't Matches");
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
};
module.exports = {
  verify: verify
};