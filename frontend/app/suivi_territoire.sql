SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE SCHEMA pr_monitoring_flora_territory;

SET search_path = pr_monitoring_flora_territory, pg_catalog;

SET default_with_oids = false;

------------------------
--TABLES AND SEQUENCES--
------------------------

CREATE TABLE infos_site (
    id_infos_site serial NOT NULL,
    id_base_site integer NOT NULL,
    cd_nom integer NOT NULL  
);
COMMENT ON TABLE pr_monitoring_flora_territory.infos_site IS 'Extension de t_base_sites de gn_monitoring, permet d\avoir les infos complémentaires d\un site';


CREATE TABLE cor_visit_grids (
    id_area integer NOT NULL,
    id_base_visit integer NOT NULL,
    presence boolean NOT NULL     
);
COMMENT ON TABLE pr_monitoring_flora_territory.cor_visit_grids IS 'Enregistrer la présence/absence d\une espèce dans une maille définie lors d\une visite';


CREATE TABLE cor_visit_perturbation (
    id_base_visit integer NOT NULL,
    id_nomenclature integer NOT NULL   
);
COMMENT ON TABLE pr_monitoring_flora_territory.cor_visit_perturbation IS 'Extension de t_base_visit de gn_monitoring, enregistrer les perturbations constatées lors d\une visite';




---------------
--PRIMARY KEY--
---------------

ALTER TABLE ONLY infos_site 
    ADD CONSTRAINT pk_id_infos_site PRIMARY KEY (id_infos_site);

ALTER TABLE ONLY cor_visit_grids 
    ADD CONSTRAINT pk_cor_visit_grids PRIMARY KEY (id_area, id_base_visit);

ALTER TABLE ONLY cor_visit_perturbation 
    ADD CONSTRAINT pk_cor_visit_perturbation PRIMARY KEY (id_base_visit, id_nomenclature);



---------------
--FOREIGN KEY--
---------------

ALTER TABLE ONLY infos_site 
    ADD CONSTRAINT fk_infos_site_id_base_site FOREIGN KEY (id_base_site) REFERENCES gn_monitoring.t_base_sites (id_base_site) ON UPDATE CASCADE ON DELETE CASCADE; 

ALTER TABLE ONLY infos_site
    ADD CONSTRAINT fk_infos_site_cd_nom FOREIGN KEY (cd_nom) REFERENCES taxonomie.taxref (cd_nom) ON UPDATE CASCADE;


ALTER TABLE ONLY cor_visit_grids 
    ADD CONSTRAINT fk_cor_visit_grids_id_base_visit FOREIGN KEY (id_base_visit) REFERENCES gn_monitoring.t_base_visits (id_base_visit) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY cor_visit_grids 
    ADD CONSTRAINT fk_cor_visit_grids_id_area FOREIGN KEY (id_area) REFERENCES ref_geo.l_areas (id_area);


ALTER TABLE ONLY cor_visit_perturbation 
    ADD CONSTRAINT fk_cor_visit_perturbation_id_base_visit FOREIGN KEY (id_base_visit) REFERENCES gn_monitoring.t_base_visits (id_base_visit) ON UPDATE CASCADE;

ALTER TABLE ONLY cor_visit_perturbation 
    ADD CONSTRAINT fk_cor_visit_perturbation_id_nomenclature FOREIGN KEY (id_nomenclature) REFERENCES ref_nomenclatures.t_nomenclatures (id_nomenclature) ON UPDATE CASCADE;


------------
--TRIGGERS--
------------
-- Idée: 
-- + Un trigger pour vérifier si id_nomenclature_perturbation dans la table cor_visit_perturbation 
--   correspond bien à celui stocké dans t_nomenclatures. 


