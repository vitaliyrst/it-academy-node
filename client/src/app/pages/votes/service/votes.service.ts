import {Injectable} from '@angular/core';
import {RestService} from "../../../core/services/rest.service";
import {map, Observable} from "rxjs";

export interface IVote {
    id: number,
    count: number,
    name: string
}

@Injectable({
    providedIn: 'root'
})
export class VotesService {

    constructor(
        private rest: RestService
    ) {
    }

    getVariants(): Observable<IVote[]> {
        return this.rest.get('/votes/variants')
            .pipe(
                map(response => response.data)
            );
    }

    getStats(): Observable<IVote[]> {
        return this.rest.get('/votes/stats')
            .pipe(
                map(response => response.data)
            );
    }

    sendVote(id: number): Observable<number> {
        return this.rest.post('/votes/vote', {id})
            .pipe(
                map(response => response.id)
            )
    }
}
