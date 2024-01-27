import { Token } from 'typedi'

export const IHelperServiceToken = new Token<IHelperService>('IHelperService')

export interface IHelperService {
    validateEmail(email: string): boolean
}