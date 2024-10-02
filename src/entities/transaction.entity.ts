export interface Transaction {
    id: number;
    id_public: string;
    amount: number;
    account_id: number;
    created_at: Date;
    type: 'credit' | 'debit';
    description: string;
}