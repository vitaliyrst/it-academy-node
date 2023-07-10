import {Component, OnInit} from '@angular/core';
import {RestService} from "../../../core/services/rest.service";

interface Lesson {
    title: string,
    date: Date,
    homework: Array<{
        id: number,
        link: string
    }>
}

@Component({
    selector: 'app-main',
    templateUrl: './postman.component.html',
    styleUrls: ['./postman.component.scss']
})
export class PostmanComponent implements OnInit {

    public requests : any = [];
    constructor(
        private restService: RestService
    ) {
    }

    ngOnInit() {
        this.restService.get('/requests')
            .subscribe(response => {
                this.requests = response.body.data;
            })
    }
}
