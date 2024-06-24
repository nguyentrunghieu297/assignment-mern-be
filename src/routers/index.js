const authRouter = require('./authRoute');
const memberRouter = require('./memberRoute');
const watchRouter = require('./watchRoute');
const brandRouter = require('./brandRoute');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/member', memberRouter);
  app.use('/watch', watchRouter);
  app.use('/brand', brandRouter);
};
