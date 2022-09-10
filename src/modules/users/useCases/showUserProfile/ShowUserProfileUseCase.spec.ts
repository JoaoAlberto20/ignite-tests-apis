import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show profile user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  });


  it('Should be able show user profile', async () => {

    const user = await createUserUseCase.execute({
      name: 'Test',
      email: 'test@test.com',
      password: 'test123456'
    })

    const showProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(showProfile).toHaveProperty('id');
  });


  it('Should not be able show user profile incorrect id', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Test',
        email: 'test@test.com',
        password: 'test123456'
      })

      await showUserProfileUseCase.execute('12345')
    }).rejects.toEqual(new ShowUserProfileError())
  })
})
