import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private apiUrl = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    public get(path: string, options: object = {}): Observable<any> {
        return this.httpClient
            .get(this.apiUrl + path, {...options, observe: 'response'})
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public post(path: string, body: object = {}, options: object = {}): Observable<any> {
        return this.httpClient
            .post(this.apiUrl + path, body, {...options, observe: 'response'})
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public put(path: string, body: object = {}, options: object = {}): Observable<any> {
        return this.httpClient
            .put(this.apiUrl + path, body, {...options, observe: 'response'})
            .pipe(
                catchError(this.formatErrors)
            );
    }


    public delete(path: string, options: object = {}): Observable<any> {
        return this.httpClient
            .delete(this.apiUrl + path, {...options, observe: 'response'})
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public formatErrors(error: any): Observable<any> {
        return throwError(error.error);
    }
}
