const router = require('express').Router();
const registrRouter = require('./registr.rout');
const autorizRouter = require('./autorization.rout');
const authorizCheck = require('./authorizCheck.rout');
const logoutRouter = require('./logout.rout');
const camperRouter = require('./camping.rout');
const adminRouter = require('./admin.rout');
const bookingRouter = require('./booking.rout')
const routRouter = require('./routplace.rout');
const routesRouter = require('./router.rout')
const profileRouter = require('./profile.rout')

const checkBookingRouter = require('./checkBooking.router');
const checkAllBookingRouter = require('./checkAllBooking.router');

router
  .use('/reg', registrRouter)
  .use('/login', autorizRouter)
  .use('/check', authorizCheck)
  .use('/logout', logoutRouter)
  
  

router.use('/admin', adminRouter)
router.use('/book', bookingRouter)

router.use('/booking', checkBookingRouter)
router.use('/allbooking', checkAllBookingRouter)
router.use('/rout', routRouter);
router.use('/camper', camperRouter);
router.use('/routes', routesRouter);
router.use('/profile', profileRouter)
module.exports = router;


