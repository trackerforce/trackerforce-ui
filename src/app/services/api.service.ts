import { HttpParams } from "@angular/common/http";
import { throwError } from "rxjs";

export class ApiService {

    protected paramFromObject(obj: any, concat?: HttpParams) {
        let params = concat ? concat : new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(item => {
                const value = JSON.parse(JSON.stringify(obj))[item];
                if (value) {
                    console.log('value', value, 'item', item)
                    params = params.set(item, value);
                }
            });
        }
        
        return params;
    }

    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            if (error.status === 401) {
                return throwError(error);
            } else if (error.status === 422) {
                errorMessage = 'Invalid arguments';
            } else if (error.status === 404) {
                errorMessage = 'Value not found';
            } else if (error.status === 503 || error.status === 0) {
                errorMessage = 'Trackerforce is offline';
            } else {
                errorMessage = error.error;
            }
        }
        return throwError(errorMessage);
    }
}