export class Paginable<T> {
    pages = 0;
    page = 0;
    items = 0;
    data: T[] = [];
}

export class PaginablePredict<T> extends Paginable<T> {
    predicted?: Prediction;
    prediction_accuracy?: number;
}

export class PageSetup {
    sortBy?: string;
    output?: string;
    page?: number;
    size?: number;
}

export class Prediction {
    id?: string;
    description?: string;
    name?: string;
}