import * as EmailValidator from 'email-validator'

export class HelperService {
    validateEmail (email: string): boolean {
        return EmailValidator.validate(email)
    }
}