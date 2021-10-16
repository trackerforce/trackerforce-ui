export class Agent {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    active: boolean = false;
    online: boolean = false;
    cases: string[] | undefined;
}