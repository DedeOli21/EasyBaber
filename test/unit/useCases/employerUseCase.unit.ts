import 'reflect-metadata'
import Container from 'typedi'
import { CreateEmployerUseCase } from '../../../src/2-business/useCases/employers/createEmployerUseCase'
import { InputCreateEmployer } from '../../../src/2-business/dto/createEmployer/inputCreateEmployerDTO'
import { IHelperServiceToken } from '../../../src/2-business/services/iHelperService'

describe('Create employers', () => {

    beforeEach(() => {
        Container.reset()

        Container.set(IHelperServiceToken, ({
            validateEmail: jest.fn().mockReturnValue(true)
        }))
    })

    const inputMockCreateEmployer: InputCreateEmployer = {
        name: 'David',
        email: 'dedepco@gmail.com',
        age: 21
    }

    const inputInvalidEmailMockCreateEmployer: InputCreateEmployer = {
        name: 'David',
        email: 'dedepco',
        age: 21
    }


    test('Should create employer with valid data', async () => {
        const useCase = Container.get(CreateEmployerUseCase)
        const response = await useCase.run(inputMockCreateEmployer)

        expect(response).toEqual('created Sucess employer David')
    })

    test('Should throw error if employer dont send valid email', async () => {
        Container.set(
            IHelperServiceToken, ({
                validateEmail: jest.fn().mockReturnValue(false)
            })
        )
        const useCase = Container.get(CreateEmployerUseCase)
        
        await expect(useCase.run(inputInvalidEmailMockCreateEmployer)).rejects.toThrow('Email is invalid')
    })
})