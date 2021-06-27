import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor(private pushSvc: PushService, private applicationRef: ApplicationRef) {}

  ngOnInit(){
    //nos subscribimos al listener
    this.pushSvc.pushListener.subscribe( noti => {
      //insertamos las notificacion al arreglo de mensajes
      this.mensajes.unshift(noti);
      this.applicationRef.tick();//vuelve hacer el deteccion de cambios nuevamente
    });
  }

  //
  async ionViewWillEnter(){
    console.log('will enter - Cargar Mensajes');
    this.mensajes = await this.pushSvc.getMensajes();
  }

}
