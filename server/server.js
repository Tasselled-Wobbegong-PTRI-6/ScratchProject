const path = require('path');
const express = require('express');
const server = express();
const cookieParser = require('cookie-parser');
const PORT = 8000;

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use('/build', express.static(path.join(__dirname, '../build')));

// app.get('/', (req, res) => {
//   const fileName = path.resolve(__dirname, '../client/index.html');
//   res.sendFile(fileName, (err) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log('sent');
//   });
// });

server.use('/api', apiRouter);
server.use('/auth', authRouter);

server.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

server.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = server;