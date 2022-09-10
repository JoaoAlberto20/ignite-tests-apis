import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;


describe('list with all user deposit and withdrawal operations', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it('Should no be able list all deposit with user not be authenticate or not exist', () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: '1234'});
    }).rejects.toEqual(new GetBalanceError());
  })

  it('Should be able list all deposit and withdrawal', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test',
      email: "test@test.com",
      password: 'test123456'
    })

    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 50,
      description: 'test',
      type: OperationType.DEPOSIT
    })


    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 50,
      description: 'test',
      type: OperationType.DEPOSIT
    })

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string })

    console.log(balance);
    // expect(balance).toBe(100);

  })
})
