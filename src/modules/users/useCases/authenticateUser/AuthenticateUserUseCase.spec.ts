import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be abe authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: 'test123456'
    }
    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticate).toHaveProperty('token');
  })

  it('Should not be able to authenticate with incorrect email', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@test.com',
        password: '123',
        name: 'User test Error',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "test1@test.com",
        password: user.password
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('Should not be able to authenticate with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@test.com',
        password: '123',
        name: 'User test Error',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '456877'
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
})
