export const TRANSACTION_TYPES = {
    RECHARGE:'recharge',
    PAYMENT:'payment',
}
export const TRANSACTION_METHODS = {
    ONLINE:'online',
    STATION:'station',
}
export const TRANSACTION_STATUS={
    PENDING:'pending',
    COMPLETED:'completed',
    FAILED:'failed',
}
export class Transaction {
    constructor({id, userId, amount, type, method, status,external_ref, timestamp}){
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.type = type;
        this.method = method;
        this.status = status;
        this.external_ref = external_ref;
        this.timestamp = timestamp;
    }
}
/**
 * RULES
 * 
 * 1.if type is recharge, method can be online or station, status can be pending, completed or failed
 * 2.if type is payment, method can only be online, status can be pending or completed
 * 3.if method is station, type can only be recharge,status can be only completed
 * 4.if method is online, type can be recharge or payment, status can be pending, completed or failed
 * 5.external_ref is required for online transactions, and should be unique
 * 6.if method is station, external_ref should be null
 * 7.amount should be positive number
 * 8.timestamp should be a valid date
 * 9.userId should be a valid user id
 * 10.id should be unique
 */