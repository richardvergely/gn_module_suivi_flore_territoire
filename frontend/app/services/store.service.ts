import { Injectable } from '@angular/core';
import { Layer } from 'leaflet';

@Injectable()
export class StoreService {

public currentLayer: Layer;


public myStylePresent = {
    color: "#008000",
    fill: true,
    fillOpacity: 0.2,
    weight: 3
};

public myStyleAbsent = {
    color: "#8B0000",
    fill: true,
    fillOpacity: 0.2,
    weight: 3
};

    
    constructor() { } 
   
   
    
    
}