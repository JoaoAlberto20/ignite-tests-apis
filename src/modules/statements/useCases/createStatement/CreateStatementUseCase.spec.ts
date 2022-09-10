import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('Should not be able make a statement with user not is authenticate or  not exist', async () => {
    expect(async () => {
      const withdraw: ICreateStatementDTO = {
        user_id: '12346',
        amount: 50,
        description: 'test',
        type: OperationType.DEPOSIT
      }
      await createStatementUseCase.execute(withdraw)
    }).rejects.toEqual(new CreateStatementError.UserNotFound())
  })


  it('Should not be able make a statement with type statement to be withdraw and  balance to be smaller than amount', () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'test',
        email: "test@test.com",
        password: 'test123456'
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 50,
        description: 'test',
        type: OperationType.WITHDRAW
      })
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds())
  })

  it('Should be able to create statement case user is authenticate and type of statement not be withdraw', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test',
      email: "test@test.com",
      password: 'test123456'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 50,
      description: 'test',
      type: OperationType.DEPOSIT
    })

    expect(statement).toHaveProperty('id');
  })
})
