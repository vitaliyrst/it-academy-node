import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "./modules/material.module";
import {PrettyJsonPipe} from './pipes/pretty-json.pipe';

@NgModule({
    declarations: [
        PrettyJsonPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        MaterialModule,
        PrettyJsonPipe
    ]
})
export class SharedModule {
}
