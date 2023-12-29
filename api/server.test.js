const request = require('supertest');
const server = require('./server'); // Correct path to your server.js file

describe('Server endpoints', () => {
  it('GET /api/auth should return 404 OK', async () => {
    const response = await request(server).get('/api/auth');
    expect(response.status).toBe(404);
  });

  // Add more tests for other endpoints similarly
});

describe('Server endpoints', () => {
  it('GET / should return 404 Not Found', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(404);
  });

  it('GET /api/auth should return 404 OK', async () => {
    const response = await request(server).get('/api/auth');
    expect(response.status).toBe(404);
  });

})
