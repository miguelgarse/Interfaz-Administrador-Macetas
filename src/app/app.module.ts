import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app.routes';
import { ClientComponent } from './components/client/client.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ExistingClientComponent } from './components/existing-client/existing-client.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    LoginComponent,
    ExistingClientComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,  
    HttpClientModule,
    APP_ROUTING,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
