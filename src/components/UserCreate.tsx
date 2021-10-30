import React from 'react';
import { useEffect, useState, Component } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";

import { DoctorInterface } from "../models/IDoctor";
import { HospitalInterface } from "../models/IHospital";
import { MedicalRecordInterface } from "../models/IMedicalRecord";
import { DiseasesInterface } from "../models/IDiseases";
import { ReferInterface } from "../models/IRefer";
import { isTemplateExpression } from 'typescript';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    text:{
      color: '#778899',
      textAlign: 'center',
    },
    textdiag:{
      
    },
    combobox: {
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '50ch',
      },
    },

    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },

    datetime: {

      margin: theme.spacing(2),
      width: 500,
    },

    textbox: {
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '83ch',
      },
    },

    button: {
      
        margin: theme.spacing(2),
        background: '#48D1CC',
        color: '#ffffff',
    },
    
    invisible: {
      visibility: "hidden"
  },
  
  }),
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};


function UserCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicalrecords, setMedicalRecords] = useState<MedicalRecordInterface[]>([]);
  const [hospitals, setHospitals] = useState<HospitalInterface[]>([]);
  const [diseases, setDiseases] = useState<DiseasesInterface[]>([]);
  const [doctos, setDoctors] = useState<DoctorInterface[]>([]);
  const [refers, setRefer] = useState<Partial<ReferInterface>>({});
  const doctors: DoctorInterface = (JSON.parse(localStorage.getItem("doctor")|| ""));
  let showname = String(doctors.Name).split(' ');
  
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };


  const getDoctors = async () => {
    fetch(`${apiUrl}/`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDoctors(res.data);
        } else {
          console.log("else");
        }
      });
  };


  const getHospitals = async () => {
    fetch(`${apiUrl}/hospitals`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setHospitals(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getDiseases = async () => {
    fetch(`${apiUrl}/diseases`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDiseases(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getMedicalRecords = async () => {
    fetch(`${apiUrl}/medical_records`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicalRecords(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const [value, setValue] = React.useState('Controlled');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown ;}>
  ) => {
    
    const name = event.target.name as keyof typeof refers;
    setRefer({
      ...refers,
      [name]: event.target.value,
    });
  };


  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  const handleInputChange = (

    event: React.ChangeEvent<{ id?: string; value: any }>
 
  ) => {
 
    const id = event.target.id as keyof typeof UserCreate;
 
    const { value } = event.target;
 
    setRefer({ ...refers, [id]: value });
 
  };

  
  

function submit() {
  let data = {
      MedicalRecordID: convertType(refers.MedicalRecordID),
      DiseaseID: convertType(refers.DiseaseID),
      HospitalID: convertType(refers.HospitalID),
      DoctorID: convertType(doctors.ID),
      Date: selectedDate,
      Diagnosis: refers.Cause ?? "",
  };

  const requestOptionsPost = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(`${apiUrl}/refers`, requestOptionsPost)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        setSuccess(true);
      } else {
        setError(true);
      }
    });
    
}


  
  useEffect(() => {
    getDoctors();
    getHospitals();
    getDiseases();
    getMedicalRecords();
  }, []);

   
  

return (

    <div>
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
          {}
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <br/><br/> 
      <Typography variant="h5" className={classes.text}>
            แบบบันทึกการส่งต่อผู้ป่วยเกินศักยภาพ
            {showname}
          </Typography>
  
      <br/>
      <Grid className={classes.paper} container spacing={0}>
        
      <Grid item xs={3}></Grid>
        <Grid item xs={3}>
         ผู้ป่วย
         <form className={classes.combobox} noValidate >
          
          
         <Select
                
                native
                variant="outlined"
                value={refers.MedicalRecordID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicalRecordID",
                }}
                style  = {{ width : 300}}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกผู้ป่วย
                </option>
                {medicalrecords.map((item: MedicalRecordInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Patient_Name}
                  </option>
                ))}
              </Select>
              
    
         </form>
        </Grid>

        
        <Grid item xs={3} >
          แพทย์ผู้รับผิดชอบ
          <form className={classes.combobox} noValidate autoComplete="off">
          
          <Select
                native
                defaultValue={0}
                variant="outlined"
                disabled
                style  = {{ width : 300}}
              >
                
                  <option value={0}>
                  {doctors.Name}
                </option>               
          </Select>
   
        </form>
           
        
        </Grid>
        
        <Grid item xs={3}></Grid>
        
        <Grid item xs={3}></Grid>  
        <Grid item xs={3}>
         โรค
         <form className={classes.combobox} noValidate autoComplete="off">
          
         <Select
         
         native
         variant="outlined"
         value={refers.DiseaseID}
         onChange={handleChange}
         inputProps={{
           name: "DiseaseID",
         }}
         style  = {{ width : 300}}
       >
         <option aria-label="None" value="">
           กรุณาเลือกโรค
         </option>
         {diseases.map((item: DiseasesInterface) => (
           <option value={item.ID} key={item.ID}>
             {item.Name}
           </option>
         ))}
         
       </Select>
    
         </form>
        </Grid>
        <Grid item xs={6}>
        

        </Grid>
        
        <Grid item xs={3}></Grid> 
        <Grid item xs={6}  className={classes.textdiag}>
          โรงพยาบาล
        <div>
        <form className={classes.combobox} noValidate autoComplete="off">
          
         <Select
         
         native
         variant="outlined"
         value={refers.HospitalID}
         onChange={handleChange}
         inputProps={{
           name: "HospitalID",
         }}
         style  = {{ width : 300}}
       >
         <option aria-label="None" value="">
           กรุณาเลือกโรงพยาบาลที่ส่งต่อ
         </option>
         {hospitals.map((item: HospitalInterface) => (
           <option value={item.ID} key={item.ID}>
             {item.Name}
           </option>
         ))}
         
       </Select>
    
         </form>
        </div>
        </Grid>
        <Grid item xs={3}></Grid> 
        
        <Grid item xs={3}></Grid> 
        <Grid item xs={3} className={classes.textdiag}>
          สาเหตุ
        <div>
        <form className={classes.textbox} noValidate autoComplete="off">
      <div>
        <TextField
          id="Cause"
          multiline
          rows={4}
          variant="outlined"
          value={refers.Cause || ""}
          onChange={handleInputChange}
        />
      </div>
    </form>
        </div>
        </Grid>
        <Grid item xs={3}></Grid>

        <Grid item xs={3}></Grid> 
        <Grid item xs={3}>
          วันที่
          <form className={classes.combobox} noValidate>
      

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  id="Date"
                  name="WatchedTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label=""
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                  style  = {{ width : 300}}
                />
              </MuiPickersUtilsProvider>
    </form>
        
        </Grid>
        <Grid item xs={7}>

        </Grid>
        <Grid item xs={3}>
        <Button className={classes.button}
              variant="contained"
              onClick={submit}
            >
              บันทึก
            </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
            <Button 
              component={RouterLink}
              to="/"
              variant="contained"
            >
              กลับ
            </Button>
            
          </Grid>
    </div>
  );
}

export default UserCreate;