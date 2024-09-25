const jwt = require('jsonwebtoken');
const ApiErrors = require('../../utils/ApiResponse/ApiErrors');

const verify = (role=[]) => {
    return (req, res, next) => {        
        try 
        {
            // Extract token from cookies or headers
            const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

            if (!token) {
                return next(ApiErrors(401, `No Token Found, ${role} token Required`));
            }

            // Verify the token
            jwt.verify(token, 'xQJslU3ieVjhYt0xCUu8hhUGayx265KgfP4W0abHhvfJJA8xFO8cYVChPGhjz0JT4w1GP3vURXdXBk8jC2Hu4W49jz', (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return next(ApiErrors(401, "Token has expired. Please login again."));
                } else if (err.name === 'JsonWebTokenError') {
                    return next(ApiErrors(401, "Invalid token. Unauthorized access."));
                } else {
                    return next(ApiErrors(401, "Unauthorized User, Incorrect Token"));
                }
            }
            
            req.user = user;

            const userRole = req.user.role; 

            if (role.includes(userRole)) {
             next();
            } else {
                return res.status(403).json({ message: 'Access denied: You do not have the required role.' 
                });
            }

                // next(); // Call next to proceed to the route handler
            });

        } catch (error) {
            return next(ApiErrors(500, `Internal Server Error  -: ${error}`));
        }
    };
};

module.exports = {
    verify,
};
