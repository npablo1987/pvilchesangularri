import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import proj4 from 'proj4';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule, 
    MapMarker],
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent {
  @Input() visible : boolean = true;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() locationSelected = new EventEmitter<{
    lat: number; lng: number; utmE: number; utmN: number; zone: number;
  }>();

  center = { lat: -18.4175578, lng: -70.2970118 };
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral | null = null;
  markerOptions: google.maps.MarkerOptions = {
    icon: ({
      url: '/assets/X.png',
      anchor: { x: 16, y: 16 },
      scaledSize: { width: 32, height: 32 }
    } as unknown) as google.maps.Icon
  };

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  save() {
    this.close();
    if (!this.markerPosition) return;
    const { lat, lng } = this.markerPosition;
    const zone = Math.floor((lng + 180) / 6) + 1;
    const [easting, northing] = proj4(
      'EPSG:4326',
      `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`,
      [lng, lat]
    );
    this.locationSelected.emit({
      lat,
      lng,
      utmE: +easting.toFixed(6),
      utmN: +northing.toFixed(6),
      zone
    });
  }

  onMapClick(evt: google.maps.MapMouseEvent) {
    const ll = evt.latLng;
    if (!ll) return;
    this.markerPosition = { lat: ll.lat(), lng: ll.lng() };
  }

  ngOnInit(): void {
    if (this.markerPosition) {
      return;
    }

    // Pide al navegador la ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          // Establece el centro en lat/lng obtenidos
          this.center = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        },
        err => {
          // Si falla (permiso denegado, timeout, etc.), abre con el centro por defecto
          console.warn('No se pudo obtener geolocalización:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Si el navegador no soporta geolocalización
      console.warn('Geolocation no soportado');
    }
  }
}
