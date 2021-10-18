import { Helper } from "./helper";

export class Task {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
    type?: string;
    learn?: boolean;
    hidden?: boolean;
    options?: Option[] | null;
    helper?: Helper;
}

export class Option {
    value?: string;
    
    constructor(value: string) {
        this.value = value;
    }
}