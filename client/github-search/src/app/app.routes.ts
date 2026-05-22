import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then((p) => p.Home),
    },
    {
        path: 'system',
        loadComponent: () => import('./pages/system/system').then((p) => p.System)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];
