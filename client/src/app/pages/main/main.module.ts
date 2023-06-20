import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {MainComponent} from './component/main.component';

const routes: Routes = [{path: '', component: MainComponent}];

@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class MainModule {
}
