import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {VotesComponent} from './component/votes.component';

const routes: Routes = [{path: '', component: VotesComponent}];

@NgModule({
    declarations: [
        VotesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class VotesModule {
}
