const { HttpStatus } = require('./result_code')
const jwt = require('jsonwebtoken');

module.exports = {
  validateToken: (req, rsp, next) => {
    const token = req.body.authToken
    let result
    if (token) {
      const options = {
        expiresIn: '2d',
        issuer: 'https://rnm.sg',
      }
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token, process.env.JWT_SECRET, options)

        // Let's pass back the decoded token to the request object
        req.decodedToken = result
        // We call next to pass execution to the subsequent middleware
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        throw new Error(err)
      }
    } else {
      result = {
        error: 'Authentication error. Token required.',
        status: HttpStatus.HTTP_401_UNAUTHORIZED,
      };
      rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED).send(result);
    }
  }
};
