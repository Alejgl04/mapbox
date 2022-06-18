import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Place } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  places: Place[] = [{
    id: '1',
    name: 'Fernando',
    lng: -75.75512993582937,
    lat: 45.349977429009954,
    color: '#dd8fee'
  },
  {
    id: '2',
    name: 'Amy',
    lng: -75.75195645527508, 
    lat: 45.351584045823756,
    color: '#790af0'
  },
  {
    id: '3',
    name: 'Orlando',
    lng: -75.75900589557777, 
    lat: 45.34794635758547,
    color: '#19884b'
  }];
  
  
  constructor() { }

  ngOnInit(): void {
    this.createMap();
  }

  createMap() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYWd1ZXJyZXJvMTk5NCIsImEiOiJjbDRqMWEzZzUwMDNpM2pwMTd4ZjlidGd0In0.euIoXepiB-X_P36Zk_5iyA';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-75.75512993582937, 45.349977429009954], // starting position [lng, lat]
      zoom: 15.8 // starting zoom
    });

    for(  const mark of this.places ) {
      this.addMarcador( mark );
    }

  }


  addMarcador( mark:Place ) {

    const html = `<h2>${ mark.name }</h2><br><button>Remove</button>`;

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setHTML( html );

    const markert = new mapboxgl.Marker({
      draggable: true,
      color: mark.color
    })
    .setLngLat([ mark.lng, mark.lat ])
    .setPopup( customPopup )
    .addTo( this.map );

    markert.on('drag', () => {
      const lngLat = markert.getLngLat();
      console.log( lngLat );
      //TODO: create event to emit the coords 
    });
  }

  createMarkert(): void {

    const customMarkert: Place = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      name: 'No name',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    }

    this.addMarcador( customMarkert );

  }
}
