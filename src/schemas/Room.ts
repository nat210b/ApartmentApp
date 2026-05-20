export type Room = {
    ID?: number;
    Number: string;
    Type: string;
    Rental_Fee: string;
    Status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
};