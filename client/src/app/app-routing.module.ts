import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'votes',
        pathMatch: 'full',
    },
    {
        path: 'votes',
        loadChildren: () => import('./pages/votes/votes.module').then(m => m.VotesModule),
    },
    {
        path: '**',
        redirectTo: 'votes'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
