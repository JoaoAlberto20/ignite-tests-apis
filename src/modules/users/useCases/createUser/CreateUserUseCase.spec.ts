import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test',
      email: 'test@test.com',
      password: 'test123456'
    });

    expect(user).toHaveProperty('id');
  })

  it('Should ot be able to create a user with email already exist', async () => {

    expect(async () => {
      await createUserUseCase.execute({
        name: 'Test',
        email: 'test@test.com',
        password: 'test123456'
      });

      await createUserUseCase.execute({
        name: 'Test',
        email: 'test@test.com',
        password: 'test123456'
      });
    }).rejects.toEqual(new CreateUserError());
  })
})
