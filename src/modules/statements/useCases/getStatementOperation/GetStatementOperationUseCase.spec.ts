import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let getStatementOperationUseCase: GetStatementOperationUseCase;
let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe('List information of operation', () => {
  beforeEach(() => {
    inMemoryStatementsRepository =  new InMemoryStatementsRepository();
    inMemoryUsersRepository =  new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository ,
      inMemoryStatementsRepository
    );
  });


  it('Should not be able list information operation if user not be authenticate or non-exist', () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: '1235', statement_id: '123456'});
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound())
  })

  it('Should be able list information operations of user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test',
      email: "test@test.com",
      password: 'test123456'
    })
    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 500,
      description: 'test',
      type: OperationType.DEPOSIT
    })
    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 100,
      description: 'test',
      type: OperationType.WITHDRAW
    })


    const {statement} = await getBalanceUseCase.execute({ user_id: user.id as string});

    const statement_id = statement[0].id as string

    const statementOperation = await getStatementOperationUseCase.execute({user_id: user.id as string, statement_id })


    expect(statementOperation).toHaveProperty('id');

  })

})
