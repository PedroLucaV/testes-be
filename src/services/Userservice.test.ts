import { User, UserInstance } from "../models/User";
import request from 'supertest'
import * as UserService from './Userservice'

describe('Testando User service', () => {

    const login = {email: "pedro@gmail.com", password: "Pedro12#"}
    const login2 = {email: "pedro@gmail.com", password: "Luiz21@"}

    //faz a sincronização entre a estrutura do model e o que está no banco de dados
    //se não existir, ele cria, se existir o "force", faz com que ele delete, e cria uma nova
    beforeAll(async () => {
        await User.sync({ force: true })
    })

    it("Criar um usuário corretamente.",async () => {
        const newUser = await UserService.createUser(login.email, login.password) as UserInstance;
        expect(newUser).not.toBeInstanceOf(Error);
        expect(newUser).toHaveProperty('id');
        expect(newUser.email).toBe(login.email);
    })

    it("Não conseguir criar um usuário.", async () => {
        const newUser = await UserService.createUser(login2.email, login2.password) as UserInstance;
        expect(newUser).toBeInstanceOf(Error);
    })

    it('Deve encontrar um usuário pelo email.', async () => {
        const User = await UserService.findByEmail(login.email) as UserInstance;
        expect(User).not.toBeInstanceOf(Error);
        expect(User.email).toBe(login.email);
    })

    it('Deve combinar com a senha no banco de dados.', async () => {
        const User = await UserService.findByEmail(login.email) as UserInstance;
        const Match = await UserService.matchPassword(login.password, User.password);
        expect(Match).toBeTruthy();
    })

    it('Não deve combinar com a senha no banco de dados.', async () => {
        const User = await UserService.findByEmail(login.email) as UserInstance;
        const Match = await UserService.matchPassword(login2.password, User.password);
        expect(Match).not.toBeTruthy();
    })

    it('Deve retornar uma lista de usuários.', async () => {
        const List = await UserService.all();
        expect(List).toHaveLength(1)
    })
})