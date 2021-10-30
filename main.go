package main

import (
	"github.com/schwd/sa-64-example/backend/controller/refer"

	"github.com/schwd/sa-64-example/backend/entity"

	"github.com/schwd/sa-64-example/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{

			// Doctor Routes
			protected.GET("/doctors", controller.ListDoctors)
			protected.GET("/doctor/:id", controller.GetDoctor)
			protected.PATCH("/doctors", controller.UpdateDoctor)
			protected.DELETE("/doctors/:id", controller.DeleteDoctor)

			// Department Routes
			protected.GET("/hospitals", controller.ListHospitals)
			protected.GET("/hospital/:id", controller.GetHospital)
			protected.POST("/hospitals", controller.CreateHospital)
			protected.PATCH("/hospitals", controller.UpdateHospital)
			protected.DELETE("/hospitals/:id", controller.DeleteHospital)

			// Disease Routes
			protected.GET("/diseases", controller.ListDiseases)
			protected.GET("/disease/:id", controller.GetDisease)
			protected.POST("/diseases", controller.CreateDisease)
			protected.PATCH("/diseases", controller.UpdateDisease)
			protected.DELETE("/diseases/:id", controller.DeleteDisease)

			// MedicalRecord Routes
			protected.GET("/medical_records", controller.ListMedicalRecord)
			protected.GET("/medical_record/:id", controller.GetMedicalRecord)
			protected.POST("/medical_records", controller.CreateMedicalRecord)
			protected.PATCH("/medical_records", controller.UpdateMedicalRecord)
			protected.DELETE("/medical_records/:id", controller.DeleteMedicalRecord)

			// MedicalHistory Routes
			protected.GET("/refers", controller.ListRefer)
			protected.GET("/refer/:id", controller.GetRefer)
			protected.POST("/refers", controller.CreateRefer)
			protected.PATCH("/refers", controller.UpdateRefer)
			protected.DELETE("/refers/:id", controller.DeleteRefer)

		}

	}

	// Doctor Routes
	r.POST("/doctors", controller.CreateDoctor)

	// Authentication Routes
	r.POST("/login", controller.Login)

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
  
	  c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
  
	  c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
  
	  c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
  
	  c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
  
  
	  if c.Request.Method == "OPTIONS" {
  
		c.AbortWithStatus(204)
  
		return
  
	  }
  
  
	  c.Next()
  
	}
  
  }
