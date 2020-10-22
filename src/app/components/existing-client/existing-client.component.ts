import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Resolve, Router } from '@angular/router';
import { ValidadoresService } from 'src/app/service/validadores.service';
import { Cliente } from '../../models/cliente';
import { Sensor } from 'src/app/models/sensor';
import { TipoSensor } from 'src/app/models/TipoSensor';
import { Sensor_Cliente } from 'src/app/models/sensor_cliente';

@Component({
  selector: 'app-existing-client',
  templateUrl: './existing-client.component.html'
})
export class ExistingClientComponent implements OnInit {
  thingsBoardId: string;
  forma: FormGroup;
  cliente: Cliente;
  tiposSensor: TipoSensor[] = [];
  deleteSensor: Sensor[] = [];
  sensoresCliente: Sensor[] = [];
  constructor(private _router: Router, private fb: FormBuilder, private _http: HttpClient, private _activatedRoute: ActivatedRoute, private validadores: ValidadoresService) {
    if(!(sessionStorage.getItem('sesion') === 'activa')){
      this._router.navigate(['/']);
    }
    this._activatedRoute.params.subscribe(params => {
      this.thingsBoardId = params['id'];
    })
    this._http.get('http://localhost:8090/api/client/' + this.thingsBoardId).subscribe((result: Cliente) => {
      this.cliente = result;
      this.crearFormulario();
    })
    this._http.get('http://localhost:8090/api/tipoSensor').subscribe((result: any[]) => {
      for (var i = 0; i < result.length; i++) {
        this.tiposSensor.push(result[i].nombre)
      }
    })
  }

  ngOnInit() {

    this._http.get('http://localhost:8090/api/sensors/client/' + this.thingsBoardId).subscribe((result: Sensor[]) => {
      this.sensoresCliente = result;
      result.forEach(sensor => {
        this.sensores.push(this.fb.group({
          nombre: [sensor.nombre],
          tipoSensorId: [sensor.tipoSensorId]
        }));

      });
    })

  }
  get sensores() {
    return this.forma.get('sensores') as FormArray;
  }
  get descripcionNoValida() {
    return this.forma.get('descripcion').invalid && this.forma.get('descripcion').touched;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      thingsboardId: [this.cliente.thingsboardId, Validators.required],
      descripcion: [this.cliente.descripcion, Validators.required],
      sensores: this.fb.array([]),
    });

  }

  agregarSensor() {
    this.sensores.push(this.fb.group({
      nombre: [''],
      tipoSensorId: ['']
    }));
  }

  borrarSensor(i: number) {
    this.deleteSensor.push(this.sensores.value[i])
    this.sensores.removeAt(i);
  }

  guardarSensorCliente(cliente: any, sensor: any) {
    const sensor_cliente = {
      sensores: sensor,
      cliente: cliente
    }
    this._http.put("http://localhost:8090/api/sensor-client", sensor_cliente).subscribe();

  }

  borrarSensorCliente(identificador: String) {
    return new Promise((resolve, reject) => {
      this._http.delete("http://localhost:8090/api/sensor-client/" + identificador).subscribe();
      resolve();
    });
  }
  guardar() {
    let cliente = {
      thingsboardId: this.forma.controls.thingsboardId.value,
      descripcion: this.forma.controls.descripcion.value
    };
    //Si se modifica algo del cliente se modifica
    if (this.forma.controls.descripcion.touched || this.forma.controls.thingsboardId.touched) {
      this._http.post("http://localhost:8090/api/client/" + this.thingsBoardId, cliente).subscribe();
    }
    //Se borran los sensores en caso de que se necesario
    this.deleteSensor.reverse().forEach(sensor => {
      this._http.get("http://localhost:8090/api/sensor-client/" + sensor.nombre).subscribe((result: Sensor_Cliente) => {
        this.borrarSensorCliente(result.id.toString()).then(() => {
          this._http.delete("http://localhost:8090/api/sensors/" + sensor.nombre).subscribe();
        })
      })
    });
    //Se añaden los sensores nuevos
    if (this.sensoresCliente.length < this.sensores.controls.length) {
      let diferencia = this.sensores.controls.length - this.sensoresCliente.length;
      for (var j = 0; j < diferencia; j++) {
        let sensor = {
          nombre: this.sensores.controls[this.sensoresCliente.length + j].value.nombre,
          tipoSensorId: this.sensores.controls[this.sensoresCliente.length + j].value.tipoSensorId
        };
        this._http.put("http://localhost:8090/api/sensors", sensor).subscribe();
        setTimeout(() =>  this.guardarSensorCliente(cliente,sensor),3000 )
      }
    }
    //Se modifican los sensores
    for (var i = 0; i < this.sensoresCliente.length; i++) {
      if (this.sensores.controls[i].touched) {
        let sensor = {
          nombre: this.sensores.controls[i].value.nombre,
          tipoSensorId: this.sensores.controls[i].value.tipoSensorId
        };
        this._http.post("http://localhost:8090/api/sensors/" + this.sensoresCliente[i].nombre, sensor).subscribe();

      }

    }
    this._router.navigate(['/home']);
    return null;
  }
}
