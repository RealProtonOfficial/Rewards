const crypto = require('crypto');

exports.generateToken = () => {
   return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
         if (err) { reject(err); } else {
            resolve(buf.toString('hex'));
         }
      });
   });
};

