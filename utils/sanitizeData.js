exports.sanitizeUser=function(user) {
    return {
        _id:user._id,
        name:user.name,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role
    };

};

exports.sanitizeUsers = function(users) {
    return users.map(user => ({
        _id:user._id,
        name:user.name,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role
    }));
  };
