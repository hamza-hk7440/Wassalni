export const TRANSACTION_TYPES = {
  RECHARGE: "Recharge",
  PAYMENT: "Payment",
};
export const TRANSACTION_METHODS = {
  ONLINE: "online",
  STATION: "station",
};
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};
export class Transaction {
  constructor({ id, user_id, amount, type, method, status, timestamp }) {
    this.id = id;
    this.user_id = user_id;
    this.amount = amount;
    this.type = type;
    this.method = method;
    this.status = status;
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
 * 5.amount should be positive number
 * 6.timestamp should be a valid date
 * 7.userId should be a valid user id
 * 8.id should be unique
 */
