import { Helper } from "./helper";
import { Task } from "./task";

export class Procedure {
    id?: string;
    name?: string;
    description?: string;
    tasks?: Task[];
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    helper?: Helper;
}