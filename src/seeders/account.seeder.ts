import { faker } from "@faker-js/faker";
import { AccountCreateDTO } from "src/dtos/account_create.dto";

export function genAccount(user_id: number): AccountCreateDTO {
    const account_pre = faker.string.numeric(5);
    const account_suf = faker.string.numeric(1);
    
    return {
        type: "checking",
        user_id: user_id,
        agency: "001",
        number: `${account_pre}-${account_suf}`,
        credit_limit: faker.number.int({min: 0, max: 10000}),
        credit_rate: Number(faker.number.float({min: 0.05, max: 0.1}).toFixed(4)),
        balance: 0,
        status: "active"
    }
}