import { User } from "../models/User";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string) => {
    const hasUser = await User.findOne({ where: { email } })
    if (!hasUser) {
        let hash = bcrypt.hashSync(password, 10)
        const newUser = await User.create({
            email,
            password: hash
        })
        return newUser
    } else {
        return new Error('Email já existe')
    }
}

export const findByEmail = async (email: string) => {
    return await User.findOne({ where: {email}})
}

export const matchPassword = async (passwordText: string, encrypted: string) => {
    return bcrypt.compareSync(passwordText, encrypted)
}

export const all = async () => {
    return await User.findAll()
}

export const deleteUser = async (email:any) => {
    const delUser = await User.destroy({where: {email}});
    if(delUser){
        return true;
    }else{
        return false;
    }
}