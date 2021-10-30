package controller

import (
	"github.com/schwd/sa-64-example/backend/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /medical_records
func CreateMedicalRecord(c *gin.Context) {
	var medicalrecord entity.MedicalRecord
	if err := c.ShouldBindJSON(&medicalrecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicalrecord})
}

// GET /medicalrecord/:id
func GetMedicalRecord(c *gin.Context) {
	var medicalrecord entity.MedicalRecord
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medical_records WHERE id = ?", id).Scan(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicalrecord})
}

// GET /medical_records
func ListMedicalRecord(c *gin.Context) {
	var medicalrecords []entity.MedicalRecord
	if err := entity.DB().Raw("SELECT * FROM medical_records").Scan(&medicalrecords).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicalrecords})
}

// DELETE /medical_records/:id
func DeleteMedicalRecord(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medical_records WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Medicalrecord not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medical_records
func UpdateMedicalRecord(c *gin.Context) {
	var medicalrecord entity.MedicalRecord
	if err := c.ShouldBindJSON(&medicalrecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicalrecord.ID).First(&medicalrecord); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Medicalrecord not found"})
		return
	}

	if err := entity.DB().Save(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicalrecord})
}