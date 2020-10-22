import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  clientes: Cliente[];
  constructor(private _router: Router,private _http: HttpClient, private fb: FormBuilder) { 
    if(sessionStorage.getItem('sesion') === 'activa'){
      this._http.get('http://localhost:8090/api/client').subscribe((result: Cliente[]) => {
        this.clientes = result;
     });
    }else{
      this._router.navigate(['/']);
    }  
  }

  ngOnInit() {
  }

  
  existingCliente(cliente: string) {
    this._router.navigate(['/client', cliente]);
  }
  newCliente() {
    this._router.navigate(['/client']);
  }
}
