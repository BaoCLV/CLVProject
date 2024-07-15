export declare class Avatars {
    id: string;
    public_id: string;
    url: string;
    userId: string;
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: Avatars | null;
    role: string;
    address: string;
    phone_number: number;
    createdAt: Date;
    updatedAt: Date;
}
