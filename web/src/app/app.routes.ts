import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/game-launcher').then((m) => m.GameLauncher),
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
    },
];
