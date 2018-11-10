import {Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { HistoryComponent } from './history/history.component';

export const appRoutes : Routes = [
    { path:'login', component: LoginComponent},
    { path: 'workspace', component: WorkspaceComponent},
    { path: 'history', component: HistoryComponent},
    { path:'',redirectTo:'/login',pathMatch:'full'}
];