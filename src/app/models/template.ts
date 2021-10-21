import { Helper } from "./helper";
import { Procedure } from "./procedure";

export class Template {
    id?: string;
    name?: string;
    description?: string;
    procedures?: Procedure[];
    createdAt?: Date;
    updatedAt?: Date;
    helper?: Helper;
}