export interface UserRegistration{
    username: string;
    password: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
}

export interface UserLogin{
    username: string;
    password: string;
}

export interface Product{
    id: number | null;
    name: string;
    category: string;
    manufacture_date: string;
    stock_status: boolean;
    discount_available: boolean;
    description: string;
    price: number;
    photo: string | null | undefined | File;
}