/** @jest-environment node */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const dotenv = require('../node_modules/dotenv');
const { transformSync } = require('@babel/core');
const Module = require('module');

jest.setTimeout(30000);

let mongod;
let app;

beforeAll(async () => {
  const envPath = path.join(__dirname, '..', '.env.example');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  process.env.MONGO_URL = envConfig.MONGO_URL.replace('localhost', '127.0.0.1');
  process.env.JWT_SECRET = 'testsecret';
  process.env.NODE_ENV = 'test';
  const url = new URL(process.env.MONGO_URL);
  mongod = await MongoMemoryServer.create({
    instance: {
      port: parseInt(url.port, 10) || 27017,
      dbName: url.pathname.slice(1),
      ip: '127.0.0.1',
    },
  });
  const filename = path.join(__dirname, '..', 'index.js');
  const src = fs.readFileSync(filename, 'utf8');
  const { code } = transformSync(src, { filename, presets: ['@babel/preset-env'] });
  const m = new Module(filename);
  m.filename = filename;
  m.paths = Module._nodeModulePaths(path.dirname(filename));
  m._compile(code, filename);
  app = m.exports.default;
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Auth routes', () => {
  test('signup and login', async () => {
    const signup = await request(app)
      .post('/api/signup')
      .send({ name: 'Test', email: 'test@example.com', password: 'pass' });
    expect(signup.status).toBe(200);
    expect(signup.body.token).toBeDefined();

    const login = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'pass' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});

describe('Conversation routes', () => {
  let token;
  beforeEach(async () => {
    await request(app)
      .post('/api/signup')
      .send({ name: 'User', email: 'user@example.com', password: 'pass' });
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'user@example.com', password: 'pass' });
    token = res.body.token;
  });

  test('create and list conversations', async () => {
    const create = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hello' });
    expect(create.status).toBe(200);
    expect(create.body.name).toBe('Hello');

    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });
});

describe('Project routes', () => {
  let token;
  beforeEach(async () => {
    await request(app)
      .post('/api/signup')
      .send({ name: 'Proj', email: 'proj@example.com', password: 'pass' });
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'proj@example.com', password: 'pass' });
    token = res.body.token;
  });

  test('create and fetch projects', async () => {
    const create = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Proj1' });
    expect(create.status).toBe(200);
    const id = create.body._id;

    const list = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);

    const get = await request(app)
      .get(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body._id).toBe(id);
  });
});
