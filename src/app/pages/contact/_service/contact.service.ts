import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Contact } from 'src/app/models/Contact';

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
};

@Injectable({
    providedIn: "root"
})
export class ContactService {
    constructor(private http: HttpClient) { }

    sendContact(contact: Contact) {
        return this.http
            .post(`${environment.apiUrl}/contact-us`, contact, httpOptions)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError(error => this.handleError(error))
            );
    }



    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side error.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend error.
            return throwError(error);
        }
        // return a custom error message
        return throwError(
            "Ohps something wrong happen here; please try again later."
        );
    }
}
