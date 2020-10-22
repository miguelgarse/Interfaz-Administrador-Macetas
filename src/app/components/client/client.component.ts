import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ValidadoresService } from 'src/app/service/validadores.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit {

  sensor:any;  
  sensors:any[]=[];
  forma: FormGroup;
  tiposSensor: any[] = [];
  private clientes: String[] = [];
  thingsBoardId: string;

  constructor(private _router: Router,private fb: FormBuilder, private _http: HttpClient, private _activatedRoute: ActivatedRoute, private validadores: ValidadoresService) {
    if(!(sessionStorage.getItem('sesion') === 'activa')){
      this._router.navigate(['/']);
    } 
    this._http.get('http://localhost:8090/api/tipoSensor').subscribe((result:any[]) => {
      for (var i = 0; i < result.length; i++) {
        this.tiposSensor.push(result[i].nombre)
      }
    })  
    this.crearFormulario();
  }

  ngOnInit() {
    this._http.get('http://localhost:8090/api/client').subscribe((result:any[])=> {
      for (var i = 0; i < result.length; i++) {
        this.clientes.push(result[i].thingsboardId)
      }
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      thingsboardId: ['',Validators.required],
      descripcion: ['', Validators.required],
      letra: [''],
      sensores: this.fb.array([]),
    }, {
      validators: this.validadores.clienteValido('thingsboardId', this.clientes)
    });

  }

  get sensores() {
    return this.forma.get('sensores') as FormArray;
  }
  get descripcionNoValida() {
    return this.forma.get('descripcion').invalid && this.forma.get('descripcion').touched;
  }
  get clienteExistente() {
    if (this.forma.controls.thingsboardId.getError('existe')) {
      return true
    }
    return false
    
  }

  get clienteVacio() {
    if ( this.forma.controls.thingsboardId.getError('vacio')  ) {
      return true
    }
    return false
    
  }

  agregarSensor() {
    this.sensores.push(this.fb.group({
      nombre: [''],
      tipoSensorId: ['']
    }));
  }

  borrarSensor(i: number) {
    this.sensores.removeAt(i);
  }

  guardarSensorCliente(cliente:any){

    for (var i = 0; i < this.sensors.length; i++) {
      const sensor_cliente={
        sensores:this.sensors[i],
        cliente:cliente
      }
      this._http.put("http://localhost:8090/api/sensor-client",sensor_cliente ).subscribe()
    }  
  }

  guardar() {
    this.sensors.splice(0,this.sensores.length );

    const cliente = {
      thingsboardId: this.forma.controls.thingsboardId.value,
      descripcion: this.forma.controls.descripcion.value,
      letra: this.forma.controls.letra.value
    };

    this.sensor = this.forma.controls.sensores
  
    this._http.put("http://localhost:8090/api/client", cliente).subscribe();
    for (var i = 0; i < this.sensor.controls.length; i++) {
      this._http.put("http://localhost:8090/api/sensors", this.sensor.controls[i].value).subscribe(result =>{
        this.sensors.push(result);
      });
    }
    setTimeout(() =>  this.guardarSensorCliente(cliente),3000 )
    this._router.navigate(['/home']);
    return null;
  }
}
