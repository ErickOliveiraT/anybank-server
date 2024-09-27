export interface Account {
    created_at: Date;
    updated_at: Date;
    id: number;
    id_public: string;
    type: string;
    user_id: number;
    agency: string;
    number: string;
    credit_limit: number;
    credit_rate:  number;
    balance: number;
    status: string;
}