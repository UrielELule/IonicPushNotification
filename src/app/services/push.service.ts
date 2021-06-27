import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[]= [];
    /*{
      title: 'Titulo',
      body: 'El cuerpo del mensaje',
      date: new Date()
    }*/
  //CREAMOS UN OBSERVABLE mandamos el payload
  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) { 

    this.cargarMensajes();

  }

  async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes]; //con spret los mandamos todos separados
  }

  configuracionInicial() {

    this.oneSignal.startInit('bead0a1f-9bfe-4faf-b338-386cba71edaa', '780108587919');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('Notificacion recibida ', noti);
      this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('Notificacion abierta ', noti)
    });

    this.oneSignal.endInit();

  }

  async notificacionRecibida(noti: OSNotification) {

    await this.cargarMensajes();

    const payload = noti.payload;

    //evitamos que se duplique la notificacion
    const existePush = this.mensajes.find( mensajes => mensajes.notificationID === payload.notificationID );
    //si exite push
    if( existePush ) {
      return;
    }

    //si no existe la notificacion
    this.mensajes.unshift( payload );//lo ingresamo al arreglo
    this.pushListener.emit( payload );//cada ves que llegue uno lo renocera y dira que hay uno nuevo
    this.guardarMensajes();//lo guardamos en el storage
    
  }

  guardarMensajes(){
    this.storage.create();
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes(){
    this.mensajes =  await this.storage.get('mensajes') || []; //como puede regresar un nul le decimos que igual si no viene info mandemes el arreglo vacion
  }


}

//bead0a1f-9bfe-4faf-b338-386cba71edaa   App ID
