import { Routes } from '@angular/router';
import { isLoginGuard } from './guards/is-login-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then((p) => p.Home),
    },
    {
        path: 'system',
        loadComponent: () => import('./pages/system/system').then((p) => p.System),
        canActivate: [isLoginGuard]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];
