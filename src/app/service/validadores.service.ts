import { Injectable } from '@angular/core';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ErrorValidate {
  [s: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {
  centinel: Boolean;
  constructor(private _http: HttpClient) { }

  clienteValido(thingsBoard: string, clientes: String[]) {
    return (formGroup: FormGroup) => {

      this.centinel = false;
      const thingsBoardControl = formGroup.controls[thingsBoard];
      if (thingsBoard == "") {
        thingsBoardControl.setErrors({ vacio: true });
      } else {
        for (var i = 0; i < clientes.length; i++) {
          if (thingsBoardControl.value === clientes[i]) {
            this.centinel = true;
          }
        }
        if (this.centinel == true) {
          thingsBoardControl.setErrors({ existe: true });
        } else {
          thingsBoardControl.setErrors(null);
        }
      }
    }
  }
}

