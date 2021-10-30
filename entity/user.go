package entity

import (
    "gorm.io/gorm"
    "time"
)

type Doctor struct {
	gorm.Model
	Name		string
	Tel			string
	Email		string			`gorm:"uniqueIndex"`
	Password	string
	// 1 Doctor เป็นเจ้าของได้หลาย Refer
	Refers				[]Refer				`gorm:"foreignKey:DoctorID"`
}


type Refer struct {
	gorm.Model
	Date				time.Time
	Cause				string
	// DoctorID ทำหน้าที่เป็น FK
	DoctorID			*uint
	// เป็นข้อมูล Doctor ใช้เพื่อให้ join ตาราง
	Doctor				Doctor
	// MedRecID ทำหน้าที่เป็น FK
	MedicalRecordID			*uint
	// เป็นข้อมูล MedicalRecord ใช้เพื่อให้ join ตาราง
	MedicalRecord				MedicalRecord

	// HospitalID ทำหน้าที่เป็น FK
	HospitalID			*uint
	// เป็นข้อมูล Hospital ใช้เพื่อให้ join ตาราง
	Hospital			Hospital

	DiseaseID 			*uint
	Disease   			Disease
}

type MedicalRecord struct {
	gorm.Model
	Hospital_Number  string `gorm:"uniqueIndex"`
	Personal_ID      string `gorm:"uniqueIndex"`
	Patient_Name     string
	Patient_Age      uint
	Patient_dob      time.Time
	Patient_Tel      string
	Register_Date    time.Time

	// 1 MedicalRecord เป็นเจ้าของได้หลาย Refer
	Refers				[]Refer							`gorm:"foreignKey:MedicalRecordID"`
}

type Hospital struct {
	gorm.Model
	Name		string
	Tel			string
	// 1 Hospital เป็นเจ้าของได้หลาย Refer
	Refers		[]Refer		`gorm:"foreignKey:HospitalID"`
}

type Disease struct {
	gorm.Model
	Name             string
	Description      string
	Refers			[]Refer				`gorm:"foreignKey:DiseaseID"`
}