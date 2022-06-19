import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Place } from 'src/app/interfaces/interfaces';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

interface Response {
  [key:string]: Place
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  places: Response = {};
  markersMb: { [id:string]: mapboxgl.Marker } = {};
    
  constructor( 
    private http: HttpClient,
    private webSocketService:WebsocketService 
  ) { }

  ngOnInit(): void {
    this.http.get<Response>(`${environment.url}/map`).subscribe( places => {      
      this.places = places;
      this.createMap();
    });
    this.listenSockets();
  }

  listenSockets() {
    //new-market
    this.webSocketService.listen('new-market').subscribe( (markert:any) =>  this.addMarcador(markert) );

    //move-market
    this.webSocketService.listen('move-market').subscribe( ( marker : any ) => this.markersMb[marker.id].setLngLat([ marker.lng, marker.lat ]));

    //remove-marker
    this.webSocketService.listen('remove-marker').subscribe( ( id : any ) => {
      this.markersMb[id].remove();
      delete this.markersMb[id];
    });
  }

  createMap() {

    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYWd1ZXJyZXJvMTk5NCIsImEiOiJjbDRqMWEzZzUwMDNpM2pwMTd4ZjlidGd0In0.euIoXepiB-X_P36Zk_5iyA';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-75.75512993582937, 45.349977429009954], // starting position [lng, lat]
      zoom: 15.8 // starting zoom
    });

    for( const [key,mark] of Object.entries(this.places) ) {
      this.addMarcador( mark );
    }
  }

  addMarcador( mark:Place ) {
    
    const h2 = document.createElement('h2');
    h2.innerText = mark.name;

    const btnRemove = document.createElement('button');
    btnRemove.innerText = 'Borrar';

    const div = document.createElement('div');
    div.append(h2, btnRemove);

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent( div );

    const markert = new mapboxgl.Marker({
      draggable: true,
      color: mark.color
    })
    .setLngLat([ mark.lng, mark.lat ])
    .setPopup( customPopup )
    .addTo( this.map );

    markert.on('drag', () => {
      const lngLat = markert.getLngLat();
      //TODO: create event to emit the coords 
      const newMarket = {
        id: mark.id,
        ...lngLat
      };
      this.webSocketService.sendEmit('move-market', newMarket );
    });

    btnRemove.addEventListener('click', () => {

      markert.remove();
      this.webSocketService.sendEmit('remove-marker', mark.id);
    
    });
    this.markersMb[mark.id] = markert;
  }

  capFirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getRandomInt(min: any, max: any) {
  	return Math.floor(Math.random() * (max - min)) + min;
  }

  generateName(){

    const firstname = ["Alex","Rocky","Pedro","Charlie","Nataly","Robert","Cris","Natasha","Ramon","David","Marco","Alexander"];
    const lastname = ["Santos","Sanchez","Stone","White","Williams","Lieuwe", 'Evans', 'Kent', 'Mcan', 'Nest', 'River', 'Alf'];

    const name = this.capFirst(firstname[this.getRandomInt(0, firstname.length + 1)]) + ' ' + this.capFirst(lastname[this.getRandomInt(0, lastname.length + 1)]);
    return name;

  }

  createMarkert(): void {
    
    const customMarkert: Place = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      name: this.generateName(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    }

    this.addMarcador( customMarkert );
    /**Emitir Marcador nuevo */
    this.webSocketService.sendEmit('new-market', customMarkert );

  }
}

