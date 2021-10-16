export class Paginable<T> {
    pages: number = 0;
    page: number = 0;
    items: number = 0;
    data: T[] = [];
}