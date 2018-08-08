import { Component, OnInit, AfterViewInit, Input, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AppConfig } from "@geonature_config/app.config";
import { MapService } from "@geonature_common/map/map.service";
import { maille } from "./mailleGeojson";
import { DataService } from "../services/data.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { StoreService} from '../services/store.service';
import { MapListService } from '@geonature_common/map-list/map-list.service';
import { DataFormService} from "@geonature_common/form/data-form.service"; 
import { ModuleConfig } from '../module.config';
import { NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: "pnx-zp-map-list",
  templateUrl: "./zp-map-list.component.html",
  styleUrls: ['./zp-map-list.component.scss'],

})
export class ZpMapListComponent implements OnInit, AfterViewInit {
   public zps;
   
   public id_ZP;
  
   public rows; 

  
   public columns = [
       { name: 'Identifiant', prop:'id_base_site' },
       { name: 'Taxon', prop: 'nom_taxon'}, 
       { name: 'Nombre de visites', prop: 'nb_visit'},
       { name: 'Date de la dernière visite', prop: 'date_max'}
              // { name: 'Actions' }
     ];
   
   public nbVisits;
   public tabNbVisits = []; 
   public dateIci; 
   public tabDate = [];
   public message = { emptyMessage: "Aucune zone à afficher ", totalMessage: "zone(s) de prospection au total" }  
   public filteredData = []; 


   constructor(public mapService: MapService, public _api: DataService, public router: Router, public storeService: StoreService,
   public mapListService:MapListService, public dataFormService: DataFormService,

   ) {}

  
   ngOnInit() {
      this.mapListService.idName = 'id_infos_site';
      let nomTaxon;  
      
      let app = 
      {
        id_application: ModuleConfig.id_application
      }

      this._api.getZp(app).subscribe(data => {
         
         this.zps = data; 
         console.log("mes data ", data.features);

         this.mapListService.loadTableData(data);
       
         this.filteredData = this.mapListService.tableData;
      });
    
      
    
   }

  


   ngAfterViewInit() {
      this.mapListService.enableMapListConnexion(this.mapService.getMap()); 

   }

   onEachFeature(feature, layer) {
      this.mapListService.layerDict[feature.id] = layer;
      layer.on({
        click: (e) => {
            // toggle style
            this.mapListService.toggleStyle(layer);
            // observable
            this.mapListService.mapSelected.next(feature.id);
            // open popup
            // layer.bindPopup(feature.properties.leaflet_popup).openPopup();
        }
      });

   }

   onInfo(id_base_site) {

      this.router.navigate([`${ModuleConfig.api_url}/listVisit`,  id_base_site])

   }

   onUpdateFilter (event) {
   
      let trans = event.toLowerCase();
     this.filteredData = this.mapListService.tableData.filter(
      ligne => {
         console.log('valeur ', event.toLowerCase());
         console.log('correspond à l\'index', ligne.nom_taxon.toLowerCase().indexOf(trans));
         
       
         return (ligne.nom_taxon.toLowerCase().indexOf(trans) !== -1) || !trans; 

     }
    )
    
    // console.log("je log tableData" , this.mapListService.tableData);

   //  this.filteredData =  result; 

    
  
  }

   onSort(event) {
      const sort = event.sorts[0];

  
      const test = event.column.prop;
    
      this.mapListService.tableData.sort((a, b) => {
        console.log("je veux sort.dir ", sort.dir);
        
         return a[test].toString().localeCompare(b[test].toString() * (sort.dir === 'desc' ? -1 : 1),  undefined,  {numeric: true})   ;
         // if (sort.dir === 'desc') {
         //    sort.dir = 'asc'; 
         //    console.log("maintenant c' depuis petit à grand");
            
         //    // return a[test].toString().localeCompare(b[test].toString() * (-1), undefined, {numeric: true}) ;
            
         // } else {
         //    sort.dir = 'desc';
         //    console.log("et là c' grn");
            
            // return a[test].toString().localeCompare(b[test].toString(), undefined, {numeric: true}) ;
            
            // }
      });

   
      
      
   }
  
}
