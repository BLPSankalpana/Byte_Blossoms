const express = require('express');
/*const app = express();
const port = 3002;

app.use(express.json());

const ordersRouter = require('./routes/orders');
app.use('/', ordersRouter);

app.listen(port, () => {
  console.log(`Microservice B is running on port ${port}`);
});*/

const knex = require('./db'); // Import the Knex instance
const app = express();
const port = 3002;

app.use(express.json());

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

// Run migrations before starting the server
knex.migrate.latest().then(() => {
  app.listen(port, () => {
    console.log(`Microservice B is running on port ${port}`);
  });
});


