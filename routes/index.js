
const authRoute=require('./authRoute');
const userRoute=require('./userRoute');
const mountRoutes = (app) => {

  app.use('/auth', authRoute);
  app.use('/user', userRoute);
  
};
  
  module.exports = mountRoutes;