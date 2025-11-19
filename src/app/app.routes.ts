import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'chat'
    },
    {
        path: 'chat',
        loadComponent: ()=>  import('../app/chat/chat.page').then(m=> m.ChatPage)
    },
    {
        path: '**',
        redirectTo: 'chat'
    }
];
