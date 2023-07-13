import {Component, OnInit} from '@angular/core';
import {RestService} from "../../../core/services/rest.service";

interface IRequest {
    id?: number,
    title?: string,
    method: string,
    url: string,
    headers: Array<{ key: string, value: string }>,
    body: Array<{ key: string, value: string }>
}

interface ITabs {
    request: string,
    response: string
}

interface IResponse {
    data: any,
    headers: Array<{ key: string, value: string }>,
    status?: number,
    statusText?: string,
    config?: any
}

@Component({
    selector: 'app-main',
    templateUrl: './postman.component.html',
    styleUrls: ['./postman.component.scss']
})
export class PostmanComponent implements OnInit {

    public preload: boolean = false;
    public response!: IResponse;
    public requests!: IRequest[];
    public selectedRequest!: IRequest;
    public requestConfig!: IRequest;
    public defaultConfig: IRequest = {
        method: 'get',
        url: '',
        headers: [{key: '', value: ''}],
        body: [{key: '', value: ''}]
    }

    public contentType: string = '';
    public openMethodsList: boolean = false;
    public selectedTabs: ITabs = {
        request: 'headers',
        response: 'body'
    };

    public errors = {
        errorMessage: '',
        errorUrl: '',
        errorTitle: ''
    }

    constructor(
        private restService: RestService,
    ) {
    }

    ngOnInit(): void {
        this.restService.get('/requests').subscribe({
            next: response => this.requests = response.data,
            error: error => this.errors.errorMessage = error.message
        });

        this.requestConfig = JSON.parse(JSON.stringify(this.defaultConfig));
    }

    onOpenMethodsList = (): void => {
        this.openMethodsList = !this.openMethodsList;
    }

    onSelectMethod(method: string): void {
        this.openMethodsList = false;
        this.requestConfig.method = method;
    }

    onSelectRequest = (request: IRequest): void => {
        this.selectedRequest = request;
        this.requestConfig = {
            id: request.id,
            title: request.title,
            method: request.method,
            url: request.url,
            headers: [
                ...request.headers,
                {key: '', value: ''}
            ],
            body: [
                ...request.body,
                {key: '', value: ''}
            ]
        };
    }

    onChangeHeaderOrBodyModel = (item: { key: string, value: string }, type: string): void => {
        const key = type === 'body' ? 'body' : 'headers';

        if (item.key || item.value) {
            const header = this.requestConfig[key][this.requestConfig[key].length - 1];

            if (header.key || header.value) {
                this.requestConfig[key].push({key: '', value: ''});
            }
        } else {
            this.requestConfig[key].splice(this.requestConfig[key].length - 1, 1);
        }
    }

    onUrlAndTitleModelChange(): void {
        if (this.requestConfig.url) {
            this.errors.errorUrl = '';
        }

        if (this.requestConfig.title) {
            this.errors.errorTitle = '';
        }
    }

    onSelectTab = (tabName: string, type: string): void => {
        if (type === 'req') {
            this.selectedTabs.request = tabName;
        }

        if (type === 'res') {
            this.selectedTabs.response = tabName;
        }
    }


    checkContentType() {
        const contentType = this.response.headers.find(header => header.key === 'content-type')?.value;
        this.contentType = contentType || 'application/json; charset=utf-8';
    }

    clearRequest = (): void => {
        this.requestConfig = this.defaultConfig;
        this.errors.errorUrl = '';
        this.errors.errorTitle = '';
        this.errors.errorMessage = '';
        this.selectedRequest = (null as any);
        this.response = (null as any);
    }

    sendRequest = (): void => {
        if (!this.requestConfig.url) {
            this.errors.errorUrl = 'URL cannot be empty';
            return;
        }

        const config: IRequest = JSON.parse(JSON.stringify(this.requestConfig));
        config.headers.splice(config.headers.length - 1, 1);
        config.body.splice(config.body.length - 1, 1);

        const newHeaders: any = {};
        config.headers.forEach(header => {
            newHeaders[header.key] = header.value;
        });

        const newBody: any = {};
        config.body.forEach(param => {
            newBody[param.key] = param.value;
        });

        config.headers = newHeaders;
        config.body = newBody;

        this.preload = true;

        this.restService.post('/do-request', config, {headers: {'Accept': '*/*'}})
            .subscribe({
                next: (response: IResponse) => {
                    const data = response;
                    const headers = Object.keys(response.headers).map((key: string) => {
                        return {key: key, value: <any>response.headers[key as keyof IResponse['headers']]}
                    });

                    this.errors.errorMessage = '';
                    this.errors.errorUrl = '';
                    this.response = {data: data.data, headers: headers, config: data.config, status: data.status};
                    this.checkContentType();
                    this.preload = false;
                },
                error: error => {
                    this.errors.errorMessage = error;
                    this.preload = false;
                }
            });
    }

    saveRequest = (): void => {
        if (!this.requestConfig.url || !this.requestConfig.title) {
            this.errors.errorUrl = !this.requestConfig.url ? 'URL cannot be empty' : '';
            this.errors.errorTitle = !this.requestConfig.title ? 'Title cannot be empty' : '';

            return;
        }

        const config = JSON.parse(JSON.stringify(this.requestConfig));
        config.headers.splice(config.headers.length - 1, 1);
        config.body.splice(config.body.length - 1, 1);

        this.restService.post('/create-request', config)
            .subscribe({
                next: response => {
                    if (!this.requests.find(request => request.id === response.id)) {
                        this.requests.push(response);
                    } else {
                        this.requests.splice(this.requests.findIndex(request => request.id === response.id), 1, response);
                    }

                    this.selectedRequest = response;
                    this.errors.errorUrl = '';
                    this.errors.errorTitle = '';
                },
                error: error => this.errors.errorMessage = error.message
            });
    }

    removeRequest(id: number | undefined): void {
        this.restService.post('/delete-request', {id})
            .subscribe({
                next: response => {
                    this.requests = this.requests.filter(request => request.id !== response.id);
                },
                error: error => this.errors.errorMessage = error.message
            });
    }
}
