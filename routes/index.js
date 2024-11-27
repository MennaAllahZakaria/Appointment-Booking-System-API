
const authRoute=require('./authRoute')
const mountRoutes = (app) => {

  app.use('/auth', authRoute);
  };
  
  module.exports = mountRoutes;