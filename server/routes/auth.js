const express = require('express');
const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');
const sessionController = require('../controllers/sessionsController');

// app.use(cookieParser());

const router = express.Router();

router.post('/signup', 
  userController.createUser, 
  // sessionController.deleteExistingSession,
  sessionController.startSession,
  cookieController.setSSIDCookie,
  (req, res) => {
    res.locals.signUpSuccess = res.locals.success;
    delete res.locals.success;
    res.status(200).json(res.locals);
  } 
);

router.get('/login', 
  userController.verifyUser, 
  // sessionController.deleteExistingSession,
  sessionController.startSession,
  cookieController.setSSIDCookie,
  (req, res) => {
    res.locals.loginSuccess = res.locals.success;
    delete res.locals.success;
    res.status(200).json(res.locals);
  }
);

router.get('/verifyLogin',
  sessionController.checkUserExists,
  sessionController.isLoggedIn,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);

module.exports = router;