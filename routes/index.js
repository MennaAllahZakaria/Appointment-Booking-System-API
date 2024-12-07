
const authRoute=require('./authRoute');
const userRoute=require('./userRoute');
const providerRoute=require('./providerRoute');
const appointmentRoute=require('./appoitmentRoute');
const reviewRoute=require('./reviewRoute');
const paymentRoute=require('./paymentRoute');
const appointmentNotification=require('../api/handler');
const mountRoutes = (app) => {

  app.use('/auth', authRoute);
  app.use('/users', userRoute);
  app.use('/providers', providerRoute);
  app.use('/appointments', appointmentRoute);
  app.use('/reviews', reviewRoute);
  app.use('/payments', paymentRoute);
  app.use('/api/appointmentNotification', appointmentNotification);
  
};
  
  module.exports = mountRoutes;