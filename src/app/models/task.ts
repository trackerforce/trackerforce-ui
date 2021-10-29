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
    helper?: Helper = new Helper();
    response?: any;
}

export class Option {
    value?: string;
    
    constructor(value: string) {
        this.value = value;
    }
}

export const TASK_TYPES = [
    {
      name: 'Plain text',
      value: 'TEXT',
      learn: false,
      options: false
    }, {
      name: 'Plain multiline text',
      value: 'MULTILINE_TEXT',
      learn: false,
      options: false
    }, {
      name: 'Number',
      value: 'NUMBER',
      learn: true,
      options: false
    }, {
      name: 'Checkbox',
      value: 'CHECK',
      learn: true,
      options: false
    }, {
      name: 'Radio',
      value: 'RADIO',
      learn: true,
      options: true
    }, {
      name: 'Drilldown',
      value: 'DRILLDOWN',
      learn: true,
      options: true
    }
  ];