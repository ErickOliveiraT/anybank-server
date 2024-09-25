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

export interface UserCreateDTO {
    name: string;
    nickname: string;
    cpf: string;
    phone: string;
    phone_whatsapp: boolean;
    email: string;
    birthdate: string;
    document_type: "cnh" | "rg",
    document_value: string,
    document_expedition_date?: string,
    document_expedition_org?: string
    mother_name: string;
    father_name: string;
    marital_status: string;
    marital_type: string | null;
    birth_country: string;
    birth_state: string;
    birth_city: string;
    address_street: string;
    address_street_number: string;
    address_complement: string;
    address_city: string;
    address_state: string;
    address_country: string;
    address_postal_code: string;
    monthly_income: number;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}