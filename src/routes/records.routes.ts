import { Router } from 'express';
import {
  createRecord,
  getRecord,
  listRecords,
  updateRecord,
  deleteRecord,
} from '../controllers/records.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const recordsRouter = Router();
recordsRouter.use(authenticate);
recordsRouter.get('/', listRecords);
recordsRouter.post('/', createRecord);
recordsRouter.get('/:id', getRecord);
recordsRouter.put('/:id', updateRecord);
recordsRouter.delete('/:id', deleteRecord);
