import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { LatLng, LatLngTuple, Map, icon, map, tileLayer } from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import * as L from 'leaflet';
import { Order } from 'src/app/shared/models/order';
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges,OnInit {
  @Input() order!:Order;
  @Input() readonly=false;
  private readonly MARKER_ZOOM_LEVEL=16;

  private readonly DEFAULT_LATLNG:LatLngTuple=[10.7870,79.1378];

 map!:L.Map;
  
  constructor(private locationService:LocationService) { 
    // console.log("map",this.order)
  }
ngOnInit(): void {
  
}
  ngOnChanges(): void {
   
    if(!this.order) return;
    if(!this.map)
    this.initializeMap()


    if(this.readonly && this.addressLatLng){
      this.showLocationReadonlyMode()
    }
  }
  currentMarker!:L.Marker;
  initializeMap(){
  
  this.map = L.map('map').setView(this.DEFAULT_LATLNG, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);
  
  this.map.on('click',(e:L.LeafletMouseEvent)=>{
    
    this.setMarker(e.latlng)
  })
  }



findMyLocation(){
  this.locationService.getCurrentLocation().subscribe(
    (latLng)=>{
      
     this.setMarker(latLng)
      
    }
  )
}
setMarker(latLng:L.LatLngExpression){
  this.addressLatLng=latLng as LatLng
  if(this.currentMarker){
    this.currentMarker.setLatLng(latLng)
    return
  } 
  this.currentMarker=  L.marker(latLng, { draggable: true })
  .addTo(this.map)
      .bindPopup('A marker here!')
      .openPopup();

      this.currentMarker.on('dragend',()=>{
         this.addressLatLng=this.currentMarker.getLatLng()
      

      })
}
set addressLatLng(latLng:LatLng){
    // if(!latLng.lat.toFixed) return
      latLng.lat=parseFloat(latLng.lat.toFixed(8))
      latLng.lng=parseFloat(latLng.lng.toFixed(8))
      this.order.addressLatLng=latLng;
      console.log("order",this.order)
}
get addressLatLng(){
  console.log("addressLatLng",this.order.addressLatLng!)

  return this.order.addressLatLng!;
}
showLocationReadonlyMode() {
  if (!this.map) {
    // console.error('Map not initialized.');
    return;
  }

  // Remove any existing markers from the map
  if (this.currentMarker) {
  this.map.removeLayer(this.currentMarker);
    
     
  }
  const m=this.map
  m.dragging.disable()
  m.touchZoom.disable()
  m.doubleClickZoom.disable()
  m.scrollWheelZoom.disable()
  m.boxZoom.disable()
  m.keyboard.disable();
  m.off('click');
  m.tap?.disable();
  
  // Add a readonly marker to the map
  // console.log("addressLatLng",typeof(this.order.addressLatLng))
  
  this.currentMarker = L.marker(this.addressLatLng!, { interactive: false })
    .addTo(this.map)
    m.setView(this.addressLatLng, 15);
}

}


