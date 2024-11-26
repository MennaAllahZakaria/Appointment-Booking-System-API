exports.sanitizeUser=function(user) {
    return {
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        Email:user.Email,
        BirthDay:user.dateOfBirthOfMam
    };

};

exports.sanitizeUsers = function(users) {
    return users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        Email: user.Email,
        Birthday: user.dateOfBirthOfMam
    }));
  };
