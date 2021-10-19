import { Procedure } from "./procedure";

export class Case {
    id?: string;
    createdAt?: Date;
    description?: string;
    protocol?: number;
    context?: string;
    procedures?: Procedure[];
    
}