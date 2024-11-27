import bcrypt from 'bcrypt'

export const generatePassword = (password: string, saltRounds: number) => {
    return bcrypt.hash(password, saltRounds)
}

export const isMatchPassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}
