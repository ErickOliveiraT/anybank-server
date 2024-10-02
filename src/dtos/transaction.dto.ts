export class TransactionStoreDTO {
    account_id: number;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
}