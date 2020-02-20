const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('Test my API responses',
        async(done) => {
            
            const response = await request(app)
                
                .get('/location?search=portland');
            
            expect(response.body).toEqual({
                formattedQuery: 'Portland, Multnomah County, Oregon, USA', 
                latitude: '45.5202471', 
                longitude: '-122.6741949'
            });
            
            expect(response.statusCode).toBe(200);
            
            done();
        });
});