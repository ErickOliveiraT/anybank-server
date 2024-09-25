import { User, UserCreateDTO } from "../models/user.model";
import prisma from '../database/connection';

interface UserRepo {
    create(data: UserCreateDTO): Promise<User>;
}

export class UserRepository implements UserRepo {

    async create(data: UserCreateDTO): Promise<User> {
        try {
            const user = await prisma.user.create({
                data: data
            });
            return this.normalizeUser({ ...user, password: '' } as UserCreateDTO);
        }
        catch (err) {
            throw new Error(err);
        }
    }

    private normalizeUser(user: UserCreateDTO): User {
        return {
            name: user.name,
            nickname: user.nickname,
            cpf: user.cpf,
            phone: user.phone,
            phone_whatsapp: user.phone_whatsapp,
            email: user.email,
            birthdate: user.birthdate,
            mother_name: user.mother_name,
            father_name: user.father_name,
            marital_status: user.marital_status,
            marital_type: user.marital_type,
            birth_country: user.birth_country,
            birth_state: user.birth_state,
            birth_city: user.birth_city,
            monthly_income: user.monthly_income,
            document: {
                type: user.document_type === 'cnh' ? 'cnh' : 'rg',
                value: user.document_value,
                expedition_date: user.document_expedition_date ?? null,
                expedition_org: user.document_expedition_org ?? null
            },
            address: {
                street: user.address_street,
                street_number: user.address_street_number,
                complement: user.address_complement,
                city: user.address_city,
                state: user.address_state,
                country: user.address_country,
                postal_code: user.address_postal_code
            },
            created_at: user.created_at,
            updated_at: user.updated_at
        } as User;
    }
}