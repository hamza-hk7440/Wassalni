export const TICKET_STATUS={
    ACTIVE:"Active",
    USED:"Used",
    EXPIRED:"Expired",
    REFUNDED:"Refunded"
};
export class User{
    constructor({
        ticket_id,
        user_id,
        schedule_id,
        qr_data,
        status,
        purshase_date,
        price,
    }){
        this.ticket_id=ticket_id;
        this.user_id=user_id;
        this.schedule_id=schedule_id;
        this.qr_data=qr_data;
        this.status=status;
        this.purshase_date=purshase_date;
        this.price=price
    }
}
/**
 * Rules
 * 1.the ticket id and purshase date will be generated automaticly ate the moment of creation of the ticket
 */
