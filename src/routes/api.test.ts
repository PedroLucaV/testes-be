import request from 'supertest'
import app from '../app'
import { User } from '../models/User'

describe('Testando rotas da API', () => {

    let email = 'test@jest.com'
    let password = '1234'

    beforeAll(async () => {
        await User.sync({ force: true })
    })

    it('Pong to be True', (done) => {
        request(app)
            .get('/ping')
            .then(response => {
                expect(response.body.pong).toBeTruthy();
                return done();
            })
    })

    it('Deve registrar um novo usuário', (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .expect(201)
            .then(response => {
                expect(response.body.error).toBeUndefined()
                expect(response.body).toHaveProperty("id")
                return done();
            })
    })

    it('Não deve registrar com email existente', (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .expect(403)
            .then(response => {
                expect(response.body.error).not.toBeUndefined()
                return done();
            })
    })

    it("Deve apagar o usuario", (done) => {
        request(app)
            .delete(`/delete/${email}`)
            .expect(204)
            .then(response => {
                expect(response.body.error).toBeUndefined()
                return done();
            })
    })
})