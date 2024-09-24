import { User } from "src/models/user.model";
import { faker } from "@faker-js/faker";

export function genUser() {
    const name = faker.person.fullName();
    const user: User = {
        name,
        nickname: name.split(' ')[0],
        cpf: faker.string.numeric({length: 11}),
        phone: faker.phone.number(),
        phone_whatsapp: true,
        email: faker.internet.email().toLowerCase(),
        birthdate: faker.date.birthdate().toISOString(),
        document: {
            type: "rg",
            value: faker.string.numeric({length: 8})
        },
        mother_name: faker.person.fullName({sex: 'female'}),
        father_name: faker.person.fullName({sex: 'male'}),
        marital_status: "single",
        marital_type: null,
        birth_country: faker.location.country(),
        birth_state: faker.location.state(),
        birth_city: faker.location.state(),
        address: {
            street: faker.location.street(),
            street_number: faker.string.numeric({length: 3}),
            complement: '',
            city: faker.location.city(),
            state: faker.location.street(),
            country: faker.location.country(),
            postal_code: faker.location.zipCode()
        },
        monthly_income: Number(faker.number.float({min: 1000, max: 25000}).toFixed(2))
    }

    return user;
}