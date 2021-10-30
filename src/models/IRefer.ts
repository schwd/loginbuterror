import { MedicalRecordInterface } from "./IMedicalRecord";
import { HospitalInterface } from "./IHospital";
import { DoctorInterface } from "./IDoctor";
import { DiseasesInterface } from "./IDiseases";

export interface ReferInterface {

    ReferID: number,

    MedicalRecordID: number,
    MedicalRecord:   MedicalRecordInterface,

    HospitalID: number,
    Hospital :  HospitalInterface,

    DoctorID : number,
    Doctor :  DoctorInterface,

    Date : Date
   
    Cause: string;

    DiseaseID: number,
    Disease :  DiseasesInterface,
   
   }