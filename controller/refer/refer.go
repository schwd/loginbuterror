package controller

import (
	"github.com/schwd/sa-64-example/backend/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /watch_videos
func CreateRefer(c *gin.Context) {

	var medicalrecord entity.MedicalRecord
	var refer entity.Refer
	var doctor entity.Doctor
	var hospital entity.Hospital
	var disease entity.Disease

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร refer
	if err := c.ShouldBindJSON(&refer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา doctor ด้วย id doctor
	if tx := entity.DB().Where("id = ?", refer.DoctorID).First(&doctor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Doctor not found"})
		return
	}

	// 10: ค้นหา medicalrecord ด้วย id medicalrecord
	if tx := entity.DB().Where("id = ?", refer.MedicalRecordID).First(&medicalrecord); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MedicalRecord not found"})
		return
	}

	// 11: ค้นหา hospital ด้วย id hospital
	if tx := entity.DB().Where("id = ?", refer.HospitalID).First(&hospital); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hospital not found"})
		return
	}

	// 11: ค้นหา disease ด้วย id disease
	if tx := entity.DB().Where("id = ?", refer.DiseaseID).First(&disease); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Disease not found"})
		return
	}

	// 12: สร้าง Refer
	wv := entity.Refer{
		MedicalRecord: medicalrecord,            // โยงความสัมพันธ์กับ Entity MedicalRecord
		Doctor:        doctor,                   // โยงความสัมพันธ์กับ Entity Doctor
		Hospital:		hospital,				//โยงความสัมพันธ์กับ Entity Hospital
		Disease: 		disease,				//โยงความสัมพันธ์กับ Entity Disease
		Cause:     		refer.Cause, 			// ตั้งค่าฟิลด์ Cause
		Date:          refer.Date,      		// ตั้งค่าฟิลด์ date
	}

	// 13: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

// GET /refer/:id
func GetRefer(c *gin.Context) {
	var refer entity.Refer
	id := c.Param("id")
	if err := entity.DB().Preload("MedicalRecord").Preload("Doctor").Preload("Hospital").Preload("Disease").Raw("SELECT * FROM refers WHERE id = ?", id).Find(&refer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": refer})
}

// GET /refer
func ListRefer(c *gin.Context) {
	var refers []entity.Refer
	if err := entity.DB().Preload("MedicalRecord").Preload("Doctor").Preload("Hospital").Preload("Disease").Raw("SELECT * FROM refers").Find(&refers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": refers})
}

// DELETE /refer/:id
func DeleteRefer(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM refers WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /refer
func UpdateRefer(c *gin.Context) {
	var refer entity.Refer
	if err := c.ShouldBindJSON(&refer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", refer.ID).First(&refer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refer not found"})
		return
	}

	if err := entity.DB().Save(&refer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": refer})
}