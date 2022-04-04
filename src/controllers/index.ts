import { Controller } from '@express';

export const Get: Controller = (req, res) => {
  res.send('Hello World');
}