import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'postman',
        pathMatch: 'full',
    },
    {
        path: 'postman',
        loadChildren: () => import('./pages/postman/postman.module').then(m => m.PostmanModule),
    },
    {
        path: '**',
        redirectTo: 'postman'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
