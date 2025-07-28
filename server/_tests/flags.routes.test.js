const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');
dotenv.config();

jest.mock('../middleware/cache', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  normalizeKey: (key) => key.replace(/\/+$/, "") || "/",
  ttlSeconds: 60,
  invalidate: jest.fn()
}));

const cache = require('../middleware/cache');
const app = require('../app');
const Flag = require('../models/Flagmodel');

const apiKey = process.env.API_KEY;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Flag.deleteMany();
  jest.clearAllMocks(); // reset mock state between tests
});

describe('Feature Flag API', () => {
  let createdFlagId = '';

  it('should create a flag', async () => {
    const res = await request(app)
      .post('/api/flags')
      .set('x-api-key', apiKey)
      .send({
        name: 'dark-mode',
        description: 'Enables dark mode UI',
        enabled: false,
        tags: ['ui']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdFlagId = res.body._id;
  });

  it('should get all flags (simulate cache miss)', async () => {
    cache.get.mockResolvedValue(null); // simulate cache miss

    await Flag.create({ name: 'demo-flag', enabled: false });

    const res = await request(app).get('/api/flags');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a flag by ID', async () => {
    const flag = await Flag.create({ name: 'flag-id-test', enabled: false });

    const res = await request(app).get(`/api/flags/${flag._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('flag-id-test');
  });

  it('should toggle the flag', async () => {
    const flag = await Flag.create({ name: 'toggle-test', enabled: false });

    const res = await request(app)
      .patch(`/api/flags/${flag._id}/toggle`)
      .set('x-api-key', apiKey);

    expect(res.statusCode).toBe(200);
    expect(res.body.enabled).toBe(true);
  });

  it('should delete the flag', async () => {
    const flag = await Flag.create({ name: 'to-delete', enabled: false });

    const res = await request(app)
      .delete(`/api/flags/${flag._id}`)
      .set('x-api-key', apiKey);

    expect(res.statusCode).toBe(204);
  });
});

// const request = require('supertest');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = require('../app');
// const Flag = require('../model/Flagmodel');

// const apiKey = process.env.API_KEY; // match with your real/test middleware

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// afterEach(async () => {
//   await Flag.deleteMany(); // clean between each test
// });

// describe('Feature Flag API', () => {
//   let createdFlagId = '';

//   it('should create a flag', async () => {
//     const res = await request(app)
//       .post('/api/flags')
//       .set('x-api-key', apiKey)
//       .send({
//         name: 'dark-mode',
//         description: 'Enables dark mode UI',
//         enabled: false,
//         tags: ['ui']
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('_id');
//     createdFlagId = res.body._id;
//   });

//   it('should get all flags', async () => {
  
//     await Flag.create({ name: 'demo-flag', enabled: false });

//     const res = await request(app).get('/api/flags');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBeGreaterThan(0);
//   });

//   it('should get a flag by ID', async () => {
//     const flag = await Flag.create({ name: 'flag-id-test' , enabled: false });

//     const res = await request(app).get(`/api/flags/${flag._id}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.name).toBe('flag-id-test');
//   });

//   it('should toggle the flag', async () => {
//     const flag = await Flag.create({ name: 'toggle-test', enabled: false });

//     const res = await request(app)
//       .patch(`/api/flags/${flag._id}/toggle`)
//       .set('x-api-key', apiKey);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.enabled).toBe(true);
//   });

//   it('should delete the flag', async () => {
//     const flag = await Flag.create({ name: 'to-delete', enabled: false  });

//     const res = await request(app)
//       .delete(`/api/flags/${flag._id}`)
//       .set('x-api-key', apiKey);

//     expect(res.statusCode).toBe(204);
//   });
// });
