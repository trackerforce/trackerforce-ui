export class Paginable<T> {
    pages: number = 0;
    page: number = 0;
    items: number = 0;
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