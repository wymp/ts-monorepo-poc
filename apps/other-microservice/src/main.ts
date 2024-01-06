import { loggingMiddleware } from '@monorepo/shared-be';
import Express from 'express';

const config = {
  port: process.env.PORT || 4000,
};

const app = Express();

app.use(loggingMiddleware(`other-microservice`));

app.get('/', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}}`;
  res.json({ status: 'ok', url });
});

app.use(((err, req, res, next) => {
  if (!err) {
    res.status(404).json({ status: 'error', error: 'Not found' });
  } else {
    res.status(500).json({ status: 'error', error: err.message });
  }
}) as Express.ErrorRequestHandler);

app.listen(config.port);
console.log(`other-microservice listening on port ${config.port}`);
