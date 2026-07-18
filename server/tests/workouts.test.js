require('./setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Workout = require('../models/Workout');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

describe('Workouts Endpoints', () => {
  let token1;
  let user1Id = 'user1';
  let token2;
  let user2Id = 'user2';
  
  beforeAll(() => {
    token1 = jwt.sign({ id: user1Id, email: 'user1@example.com' }, JWT_SECRET);
    token2 = jwt.sign({ id: user2Id, email: 'user2@example.com' }, JWT_SECRET);
  });

  it('should reject missing or invalid token', async () => {
    const res = await request(app).get('/api/workouts');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a workout successfully when authenticated', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Morning Run',
        goal: 'general',
        duration_minutes: 30,
        equipment: [],
        exercises: [{ name: 'Running', sets: 1, reps: '30 min', rest: 'none', notes: 'Easy pace' }]
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toEqual(user1Id);
  });

  it('should return pagination metadata on list workouts', async () => {
    // create a few more workouts
    for (let i = 0; i < 3; i++) {
      await Workout.create({
        userId: user1Id,
        name: `Workout ${i}`,
        goal: 'general',
        duration_minutes: 30,
        exercises: []
      });
    }

    const res = await request(app)
      .get('/api/workouts?page=1&limit=2')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.workouts.length).toEqual(2);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toEqual(1);
    expect(res.body.pagination.limit).toEqual(2);
    expect(res.body.pagination.total).toEqual(3);
    expect(res.body.pagination.totalPages).toEqual(2);
  });

  it('should list only the requesting user\'s workouts (ownership scoping)', async () => {
    await Workout.create({
      userId: user2Id,
      name: 'User 2 Workout',
      goal: 'general',
      duration_minutes: 30,
      exercises: []
    });

    const res = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${token2}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.workouts.length).toEqual(1);
    expect(res.body.workouts[0].userId).toEqual(user2Id);
  });

  it('should reject update/delete when the workout belongs to another user', async () => {
    const workout = await Workout.create({
      userId: user1Id,
      name: 'To delete',
      goal: 'general',
      duration_minutes: 30,
      exercises: []
    });

    const delRes = await request(app)
      .delete(`/api/workouts/${workout._id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(delRes.statusCode).toEqual(404);
  });
});
