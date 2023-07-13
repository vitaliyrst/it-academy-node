import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {PostmanComponent} from './component/postman.component';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {NgOptimizedImage} from "@angular/common";

const routes: Routes = [{path: '', component: PostmanComponent}];

@NgModule({
    declarations: [
        PostmanComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        NgOptimizedImage
    ]
})
export class PostmanModule {
}
