import { Inject, Service } from "typedi";
import { InputCreateEmployer } from "../../dto/createEmployer/inputCreateEmployerDTO";
import { IHelperService, IHelperServiceToken } from "../../services/iHelperService";


@Service({ transient: false })
export class CreateEmployerUseCase {
    @Inject(IHelperServiceToken)
    private readonly helperService!: IHelperService

    async run (input: InputCreateEmployer): Promise<any> {
        const { name, email } = input

        if (!this.helperService.validateEmail(email)) {
            throw new Error('Email is invalid')
        }
        
        return `created Sucess employer ${name}`
    }
}