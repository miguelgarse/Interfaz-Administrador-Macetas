import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ClientComponent } from './components/client/client.component';
import { ExistingClientComponent } from './components/existing-client/existing-client.component';
import { HomeComponent } from './components/home/home.component';

const APP_ROUTES: Routes = [
  { path: '', component: LoginComponent },  
  { path: 'home', component: HomeComponent },  
  { path: 'client', component: ClientComponent }, 
  { path: 'client/:id', component: ExistingClientComponent },  

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:true});
