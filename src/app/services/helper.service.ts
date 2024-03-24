import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Helper } from "../models/helper";

@Injectable({
    providedIn: "root"
})
export class HelperService {
    
    public helper = new Subject<Helper | undefined>();

}