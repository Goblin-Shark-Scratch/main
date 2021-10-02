const path = require('path');
const express = require('express');
const app = express();
const ideatorRouter = require('./routes/api');
const PORT = 3000;


// handle parsing request body
app.use(express.json());

/**
 * handle requests for static files
 */
 app.use(express.static(path.resolve(__dirname, '../dist')));

// add get and post requests related to the goal tracker here. 
console.log('testing to see if this works'),


// add route handler   
app.use('/api', ideatorRouter) 


// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

// express error handler 
app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });


/**
 * start server
 */
 app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
  });



module.exports = app;