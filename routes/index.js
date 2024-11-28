
const authRoute=require('./authRoute');
const userRoute=require('./userRoute');
const providerRoute=require('./providerRoute');
const mountRoutes = (app) => {

  app.use('/auth', authRoute);
  app.use('/users', userRoute);
  app.use('/providers', providerRoute);
  
};
  
  module.exports = mountRoutes;