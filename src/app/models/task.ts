import { Helper } from "./helper";

export class Task {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
    type?: string;
    learn?: boolean;
    hidden?: boolean;
    helper?: Helper;
}