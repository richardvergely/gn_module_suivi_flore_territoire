import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { AppConfig } from "@geonature_config/app.config";
import { MapService } from "@geonature_common/map/map.service";
import { maille } from "./mailleGeojson";
import { DataService } from "../services/data.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { GeojsonComponent } from '@geonature_common/map/geojson.component';

import { ActivatedRoute} from '@angular/router';
import { StoreService } from '../services/store.service'
import { DataFormService} from "@geonature_common/form/data-form.service"; 
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { CommonService } from '@geonature_common/service/common.service';

@Component({
    selector: 'selector-list-visit',
    templateUrl: 'list-visit.component.html',
    styleUrls: ['./list-visit.component.scss'],

})

export class ListVisitComponent implements OnInit, AfterViewInit {
public zps;
public currentZp = {};
public idSite; 
public compteAbsent = 0; 
public comptePresent = 0; 
public rest; 
public especeSuivi; 
public infoSite; 
public visitGrid : FormGroup; 
public visit_boo = false;
public idMaille; 
public visits = {};
public codeTaxon; 
public idVisit;
public coordonne ; 

public rows: {id_base_visit: number, visit_date: string, observers:string}[];

public columns = [
    { name: 'Identifiant', prop:'id_base_visit' },
    { name: 'Date', prop: 'visit_date'}, 
    { name: 'Observer', prop: "observers" },
    // { name: 'Actions' }
  ];

@ViewChild('geojson') geojson: GeoJsonComponent
    
constructor(public mapService: MapService, 
        public _api: DataService, 
        public activatedRoute: ActivatedRoute, 
        public storeService: StoreService, 
        public router: Router, 
        public dataFormService: DataFormService,
        private _fb: FormBuilder,
        public dateParser: NgbDateParserFormatter,
        private toastr: ToastrService,
        private _commonService: CommonService,) { }

    ngOnInit() {
        this.idSite = this.activatedRoute.snapshot.params['idSite'];
        
        
        const param = {
          id_base_site: this.idSite,
        }
        this._api.getVisits(param).subscribe(data => {
        console.log( " donnée visite ", data );
        
         data.forEach( visit => {
            let fullName; 
             visit.observers.forEach( obs => {
                fullName = obs.nom_role + " " + obs.prenom_role; 
                
             })
             visit.observers = fullName;
         } );
        
         this.rows = data;

      
        })


     }
    
    ngAfterViewInit(){
        this.mapService.map.doubleClickZoom.disable();
        const parametre = {
            id_base_site: this.idSite,
          }
        this.activatedRoute.params.subscribe(params => {
   
                                    
              
            this._api.getZp(parametre).subscribe(data => {
                
                this.zps = data;
                this.geojson.currentGeoJson$.subscribe(currentLayer => {
                    this.mapService.map.fitBounds(currentLayer.getBounds()); 
                });
                
               
            })
        })

    }

    onEachFeature(feature, layer) {
        this.currentZp = feature.id;
       
    }

    onEdit(id_visit) {
        this.router.navigate(['suivi_flore_territoire/editVisit',  id_visit])
    }

    onInfo(id_visit) {
      this.router.navigate(['suivi_flore_territoire/infoVisit',  id_visit])

    }

    onAdd() {
        this.router.navigate(['suivi_flore_territoire/afficheMaille', this.idSite]);        
    }
   
}