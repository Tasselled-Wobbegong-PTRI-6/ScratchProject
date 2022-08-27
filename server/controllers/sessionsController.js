const db = require('../models/newsModel.js');
const queries = require('./queries.js');

const sessionController = {};

sessionController.deleteExistingSession = (req, res, next) => {
  const { username } = req.body;

  db.query(queries.getUserFromUsername, [username], (userErr, userRes) => {
    
    if (userErr) {
      const err = {
        log: `Query error in sessionController.deleteExistingSession: ${userErr}`,
        status: 500,
        message: 'Error deleting session. See console.'
      };
      return next(err);
    };

    const user_id = userRes.rows[0]._id;
    db.query(queries.deleteSession, [user_id], (deleteErr, deleteRes) => {
      if (deleteErr) {
        const err = {
          log: `Query error in sessionController.deleteExistingSession: ${deleteErr}`,
          status: 500,
          message: 'Error deleting session. See console.'
        };
        return next(err);
      };

      return next();
    })


  });
}

sessionController.startSession = (req, res, next) => {
  const { username } = req.body;

  // try {
  //   const deleteSessionSuccess = await deleteExistingSession(username);
  //   if (!deleteSessionSuccess) res.locals.success = false;
  // } catch (err) {
  //   return next(err);
  // }
  
  const deleteSessionSuccess = await deleteExistingSession(username);
  if (!deleteSessionSuccess) res.locals.success = false;
  if (typeof(deleteSessionSuccess) === "object") return next(err);

  if (!res.locals.success) return next();

  db.query(queries.getUserFromUsername, [username], (userErr, userRes) => {

    if (userErr) {
      const err = {
        log: `Query error in sessionController.startSession: ${userErr}`,
        status: 500,
        message: 'Error getting user data for session. See console.'
      };
      return next(err);
    };

    if (userRes.rows.length === 0) {
      res.locals.startSessionSuccess = false;
      res.locals.success = false;
      next();
    }

    const userId = userRes.rows[0]._id;
    db.query(queries.postSession, [userId], (queryErr, queryRes) => {

      if (queryErr) {
        const err = {
          log: `Query error in sessionController.startSession: ${queryErr}`,
          status: 500,
          message: 'Error posting session data. See console.'
        };
        return next(err);
      };
  
      res.locals.startSessionSuccess = true;
      next();
  
    });

  });
};

sessionController.isLoggedIn = (req, res, next) => {
  if (!res.locals.userExists) return next();
  const { ssid } = req.cookies;

  db.query(queries.getSession, [ssid], (queryErr, queryRes) => {

    if (queryErr) {
      const err = {
        log: `Query error in sessionController.isLoggedIn: ${queryErr}`,
        status: 500,
        message: 'Error getting session data. See console.'
      };
      return next(err);
    };

    if (queryRes.rows.length === 0) {
      res.locals.isLoggedIn = false;
      return next();
    }

    console.log(queryRes.rows);
    let { expiration } = queryRes.rows[0];
    expiration = timestampToMs(expiration);
    if (Date.now() > expiration) {
      res.locals.isLoggedIn = false;
      return next();
    }
    res.locals.isLoggedIn = true;
    return next();

  });
}

sessionController.checkUserExists = (req, res, next) => {
  const { ssid } = req.cookies;

  if (!ssid) {
    res.locals.userExists = false;
    return next();
  }

  db.query(queries.getUserFromId, [ssid], (userErr, userRes) => {
    
    if (userErr) {
      const err = {
        log: `Query error in sessionController.checkUserExists: ${userErr}`,
        status: 500,
        message: 'Error getting user data for session. See console.'
      };
      return next(err);
    };

    if (userRes.rows.length === 0) {
      res.locals.userExists = false;
      return next();
    }

    res.locals.userExists = true;
    return next();

  });
}

const timestampToMs = (timestamp) => {
  console.log(`${timestamp}`);
  console.log(timestamp);
  const timestampString = JSON.stringify(timestamp);
  const timeSplit = timestampString.split(/[- : . T Z]/);
  return Date.UTC(timeSplit[0], timeSplit[1]-1, timeSplit[2], timeSplit[3], timeSplit[4], timeSplit[5], timeSplit[6]);
}


const deleteExistingSession = async (username) => {
  const err = {
    log: `Query error in deleteExistingSession: `,
    status: 500,
    message: 'Error deleting session. See console.'
  };
  throw err;
  let user_id;
  try {

    const userRes = await db.queryAsync(queries.getUserFromUsername, [username]);
    if (userRes.rows.length === 0) return false;
    user_id = userRes.rows[0]._id;

  } catch (userErr) {

    const err = {
      log: `Query error in deleteExistingSession: ${userErr}`,
      status: 500,
      message: 'Error deleting session. See console.'
    };
    return err;

  }

  try {

    await db.queryAsync(queries.deleteSession, [user_id]);
    return true;

  } catch (deleteErr) {
    const err = {
      log: `Query error in deleteExistingSession: ${deleteErr}`,
      status: 500,
      message: 'Error deleting session. See console.'
    };
    return err;
  }

};

module.exports = sessionController;