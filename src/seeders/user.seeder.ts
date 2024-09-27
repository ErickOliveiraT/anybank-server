import { UserCreateDTO } from "src/dtos/user_create.dto";
import { faker } from "@faker-js/faker";

export function genUser(): UserCreateDTO {
    const name = faker.person.fullName();
    const ddd = faker.string.numeric({ length: 2 });
    const phone_number = faker.string.numeric({ length: 8 });
    const user: UserCreateDTO = {
        name,
        nickname: name.split(' ')[0],
        cpf: faker.string.numeric({ length: 11 }),
        phone: `+55${ddd}${phone_number}`,
        phone_whatsapp: true,
        email: faker.internet.email().toLowerCase(),
        birthdate: faker.date.birthdate().toISOString().substring(0, 10),
        document_type: "rg",
        document_value: faker.string.numeric({ length: 8 }),
        mother_name: faker.person.fullName({ sex: 'female' }),
        father_name: faker.person.fullName({ sex: 'male' }),
        marital_status: "single",
        marital_type: null,
        birth_country: faker.location.country(),
        birth_state: faker.location.state(),
        birth_city: faker.location.state(),
        address_street: faker.location.street(),
        address_street_number: faker.string.numeric({ length: 3 }),
        address_complement: '',
        address_city: faker.location.city(),
        address_state: faker.location.street(),
        address_country: faker.location.country(),
        address_postal_code: faker.location.zipCode(),
        monthly_income: Number(faker.number.float({ min: 1000, max: 25000 }).toFixed(2)),
        password: "admin"
    }

    return user;
}