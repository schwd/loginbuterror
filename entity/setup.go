package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-64.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&Doctor{},  &Refer{}, &MedicalRecord{}, &Hospital{}, &Disease{},
	)

	db = database

	Pass1, err := bcrypt.GenerateFromPassword([]byte("1"), 14)
	Pass2, err := bcrypt.GenerateFromPassword([]byte("123"), 14)

	Doctor1 := Doctor{
		Name: "Faii",
		Email: "faii@gmail.com",
		Password: string(Pass1),
		Tel: "044",
	}
	db.Model(&Doctor{}).Create(&Doctor1)

	Doctor2 := Doctor{
		Name: "suchawadee",
		Email: "b6238124@gmail.com",
		Password: string(Pass2),
		Tel: "089",
	}
	db.Model(&Doctor{}).Create(&Doctor2)

	MedicalRecord1 := MedicalRecord{
		Hospital_Number: "123",
		Personal_ID: "123456789",
		Patient_Name: "Suchawadee Tiangtrong",
		Patient_Age: 14,
		Patient_dob: time.Now(),
		Patient_Tel: "0878807717",
		Register_Date: time.Now(),
	}
	db.Model(&MedicalRecord{}).Create(&MedicalRecord1)

	Hospital1 := Hospital{
		Name: "sut",
		Tel: "044123456",
	}
	db.Model(&Hospital{}).Create(&Hospital1)

	Hospital2 := Hospital{
		Name: "bangkok hospital",
		Tel: "044987654",
	}
	db.Model(&Hospital{}).Create(&Hospital2)

	Disease1 := Disease{
		Name: "Cancer",
		Description: "Cancer is a disease caused when cells divide uncontrollably and spread into surrounding tissues",
	}
	db.Model(&Disease{}).Create(&Disease1)
}