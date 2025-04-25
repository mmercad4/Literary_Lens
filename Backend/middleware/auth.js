const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  console.log("===== Auth Middleware Debugging =====");
  console.log("Request path:", req.originalUrl);
  
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;
  console.log("Authorization header present:", !!authHeader);
  
  if (!authHeader) {
    console.log("ERROR: No Authorization header found");
    return res.status(401).json({ message: 'No token provided - missing Authorization header' });
  }
  
  // Check if it starts with 'Bearer '
  console.log("Header starts with 'Bearer ':", authHeader.startsWith('Bearer '));
  
  if (!authHeader.startsWith('Bearer ')) {
    console.log("ERROR: Authorization header doesn't start with 'Bearer '");
    console.log("Actual header:", authHeader);
    return res.status(401).json({ message: 'Invalid token format - must start with Bearer' });
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  console.log("Token extracted:", token ? `${token.substring(0, 10)}...` : "no token after Bearer");
  
  if (!token) {
    console.log("ERROR: No token found after 'Bearer'");
    return res.status(401).json({ message: 'No token provided after Bearer prefix' });
  }
  
  try {
    // IMPORTANT: Make sure this matches your login secret
    const secret = 'your_secret_key';
    console.log("Using secret key:", secret.substring(0, 3) + "...");
    
    // Verify the token
    console.log("Attempting to verify token...");
    const decoded = jwt.verify(token, secret);
    
    // Print token details
    console.log("Token verified successfully!");
    console.log("Decoded token:", {
      userId: decoded.userId,
      exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'No expiration',
      iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'No issued at time'
    });
    
    // Attach user info to request
    req.user = decoded;
    console.log("User info attached to request");
    console.log("===== Auth Middleware Success =====");
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log("ERROR: Token verification failed");
    console.log("Error type:", error.name);
    console.log("Error message:", error.message);
    console.log("===== Auth Middleware Failed =====");
    
    return res.status(401).json({ 
      message: 'Invalid token', 
      error: error.message 
    });
  }
};

module.exports = authenticate;