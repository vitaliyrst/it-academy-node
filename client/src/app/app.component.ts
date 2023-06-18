import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "./core/services/rest.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'client';

    constructor(
        private rest: RestService
    ) {
    }

    ngOnInit() {
        this.rest.get('/votes/variants')
            .subscribe({
                next: response => {
                    console.log(response)
                }
            })
    }
}
