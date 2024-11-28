
const authRoute=require('./authRoute');
const userRoute=require('./userRoute');
const providerRoute=require('./providerRoute');
const appointmentRoute=require('./appoitmentRoute');
const mountRoutes = (app) => {

  app.use('/auth', authRoute);
  app.use('/users', userRoute);
  app.use('/providers', providerRoute);
  app.use('/appointments', appointmentRoute);
  
};
  
  module.exports = mountRoutes;