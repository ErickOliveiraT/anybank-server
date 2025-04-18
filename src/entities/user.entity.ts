export interface User {
    id: number;
    id_public: string;
    name: string;
    nickname: string;
    cpf: string;
    phone: string;
    phone_whatsapp: boolean;
    email: string;
    birthdate: string;
    document: {
        type: "cnh" | "rg",
        value: string,
        expedition_date?: string,
        expedition_org?: string
    };
    mother_name: string;
    father_name: string;
    marital_status: string;
    marital_type: string | null;
    birth_country: string;
    birth_state: string;
    birth_city: string;
    address: {
        street: string;
        street_number: string;
        complement: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
    monthly_income: number;
    created_at: Date;
    updated_at: Date;
}

export interface UserWithCredentials extends User {
    password: string;
}