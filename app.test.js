const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('Test my API responses',
        async(done) => {
            
            const response = await request(app)
                
                .get('/location');
            
            expect(response.body).toEqual({
                formattedQuery: expect.any(String), 
                latitude: expect.any(String), 
                longitude: expect.any(String)
            });
            
            expect(response.statusCode).toBe(200);
            
            done();
        });
});