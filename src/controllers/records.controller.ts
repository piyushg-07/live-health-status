import { RequestHandler } from 'express';
import { RecordsService } from '../services/records.service';
import { CacheService } from '../services/cache.service';
import { QueueService } from '../services/queue.service';

const VALID_STATUSES = ['Healthy', 'Sick', 'Critical'] as const;
type Status = typeof VALID_STATUSES[number];

/** Full-body validator for creation */
function validateRecordBody(body: any) {
  const { name, age, status } = body;
  if (
    typeof name !== 'string' ||
    name.trim() === '' ||
    typeof age !== 'number' ||
    age <= 0 ||
    !VALID_STATUSES.includes(status)
  ) {
    const err = new Error('Invalid record data');
    // @ts-expect-error custom prop
    err.statusCode = 400;
    throw err;
  }
}

/** Per-field validator for updates */
function validateUpdateBody(body: any) {
  if ('name' in body) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      const err = new Error('Invalid name');
      // @ts-expect-error custom prop
      err.statusCode = 400;
      throw err;
    }
  }
  if ('age' in body) {
    if (typeof body.age !== 'number' || body.age <= 0) {
      const err = new Error('Invalid age');
      // @ts-expect-error custom prop
      err.statusCode = 400;
      throw err;
    }
  }
  if ('status' in body) {
    if (!VALID_STATUSES.includes(body.status)) {
      const err = new Error('Invalid status');
      // @ts-expect-error custom prop
      err.statusCode = 400;
      throw err;
    }
  }
}

// Create
export const createRecord: RequestHandler = async (req, res, next) => {
  try {
    validateRecordBody(req.body);
    const record = await RecordsService.create(req.body);
    await QueueService.publishUpdate({ action: 'create', record });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

// Read
export const getRecord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cached = await CacheService.get(id);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }
    const record = await RecordsService.findById(id);
    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    await CacheService.set(id, JSON.stringify(record));
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateRecord: RequestHandler = async (req, res, next) => {
  try {
    // Validate only the fields provided
    validateUpdateBody(req.body);

    const { id } = req.params;
    const updated = await RecordsService.update(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    await CacheService.del(id);
    await QueueService.publishUpdate({ action: 'update', record: updated });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteRecord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await RecordsService.delete(id);
    await CacheService.del(id);
    await QueueService.publishUpdate({ action: 'delete', record: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


// List all
export const listRecords: RequestHandler = async (_req, res, next) => {
  try {
    const all = await RecordsService.findAll();
    res.json(all);
  } catch (err) {
    next(err);
  }
};