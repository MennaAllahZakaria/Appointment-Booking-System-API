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

  exports.sanitizeProvidor=function(provider) {
    return {
        _id:provider._id,
        name:provider.name,
        email:provider.email,
        phoneNumber:provider.phoneNumber,
        role:provider.role,
        specialty:provider.specialty,
        availability:provider.availability
    };

};

exports.sanitizeProviders = function(users) {
    return users.map(provider => ({
        _id:provider._id,
        name:provider.name,
        email:provider.email,
        phoneNumber:provider.phoneNumber,
        role:provider.role,
        specialty:provider.specialty,
        availability:provider.availability
    }));
};