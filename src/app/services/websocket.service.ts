import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus: boolean = false;
  constructor(
    private socket: Socket,
  ) { 
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('desconectado al servidor');
      this.socketStatus = false;
    });
  }

  sendEmit( event: string, payload?: any, callback?: Function  ) {
    console.log('Emitiendo', event);
    this.socket.emit( event, payload, callback );
  }

  listen( event: string ) {
    return this.socket.fromEvent( event );
  }
}
