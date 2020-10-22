import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  forma: FormGroup;
  constructor(private _router: Router,private _http: HttpClient, private fb: FormBuilder) {
      this.crearFormulario();
        }
  ngOnInit() {
  }
  crearFormulario() {
    this.forma = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });

  }
  login() {
    let params = new HttpParams().set('user', this.forma.controls.usuario.value).set('pass', this.forma.controls.password.value);
    this._http.get('http://localhost:8090/api/login', { headers: null, params: params }).subscribe((result: usuario) => {
     if(this.forma.controls.usuario.value === result.usuario){
       sessionStorage.setItem('sesion','activa')
      this._router.navigate(['/home']);
     }else{
       window.location.reload();
     }
    
    });
  }

}
