import { Injectable } from '@nestjs/common';
import { genUser } from 'src/seeders/user.seeder';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

@Injectable()
export class UserService {
    async createUser(data: any) {
        if (data.seeder || true) {
            const user = this.normalizeUser(genUser());

            const res = await prisma.user.create({
                data: user
            }) 
            return res;
        }
    }

    normalizeUser(data: any) {
        const user = data;
        user.document_type = user.document.type;
        user.document_value = user.document.value;
        if (user.document.expedition_date) {
            user.document_expedition_date = user.document.expedition_date;
        }
        if (user.document.expedition_org) {
            user.document_expedition_org = user.document.expedition_org;
        }
        user.address_street = user.address.street;
        user.address_street_number = user.address.street_number;
        user.address_complement = user.address.complement;
        user.address_city = user.address.city;
        user.address_state = user.address.state;
        user.address_country = user.address.country;
        user.address_postal_code = user.address.postal_code;
        delete user.document;
        delete user.address;

        return user;
    }
}