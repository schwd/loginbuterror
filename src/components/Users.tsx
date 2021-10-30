import React, { useEffect , useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
//import { visuallyHidden } from '@mui/utils';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import moment from 'moment';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { ReferInterface } from "../models/IRefer";
import { format } from 'date-fns'
import { MedicalRecordInterface } from "../models/IMedicalRecord";
import { DiseasesInterface } from "../models/IDiseases";
import { HospitalInterface } from "../models/IHospital";
import { DoctorInterface } from "../models/IDoctor";
import Refers from "./Users";
const useStyles = makeStyles((theme: Theme) =>

 createStyles({

   container: {marginTop: theme.spacing(2)},

   table: { minWidth: 650},

   tableSpace: {marginTop: 20},

   colorr: {
    background: 'linear-gradient(45deg, #FFF0F5 25%, #FFF0F5 90%)',
    
  },

 })

);

interface Column {
  id: 'DoctorID' | 'MedicalRecordID' | 'HospitalID' | 'DiseaseID' | 'Cause' | 'Date';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columnsss: GridColDef[] = [
  { field: 'refers.ID', headerName: 'ID', width: 200 },
  
]

const columns: readonly Column[] = [
  {
    id: 'DoctorID',
    label: 'Name',
  },
  {
    id: 'MedicalRecordID',
    label: 'Name',
  },
  {
    id: 'HospitalID',
    label: 'Hospital',
  },
  {
    id: 'DiseaseID',
    label: 'Disease',
  },
  {
    id: 'Cause',
    label: '',
  },

  {
  id: 'Date',
    label: 'Date',
  },
];


function createData(
  ReferID: number,
  MedicalRecordID: number,
  MedicalRecord:   MedicalRecordInterface,

  DiseaseID: number,
  Disease :  DiseasesInterface,

  Cause:string,

  HospitalID :number,
  Hospital:   HospitalInterface,

  DoctorID : number,
  Doctor :  DoctorInterface,

  Date : Date
): ReferInterface {
  return {
      ReferID,
      MedicalRecordID,
      MedicalRecord,
      DiseaseID,
      Disease,
      Cause,
      HospitalID,  
      Hospital,
      DoctorID,
      Doctor,
      Date,
  };
}

type Order = 'asc' | 'desc';

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const classes = useStyles();
  const [refers, setRefers] = useState<ReferInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };


  const getRefers = async () => {
    fetch(`${apiUrl}/refers`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setRefers(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getRefers();
  }, []);
  

  const [order, setOrder] = React.useState<Order>('desc');
  const [searched, setSearched] = useState<string>("");
  const requestSearch = (searchedVal: string) => {
    const filteredRows = refers.filter((row) => {
      return row.MedicalRecord.Patient_Name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRefers(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow key={row.ReferID} >
        <TableCell align="center">{row.Doctor.Name}</TableCell>
          <TableCell align="center" >{row.MedicalRecord.Patient_Name}</TableCell>
                      
                      
                      <TableCell align="center">{row.Hospital.Name}</TableCell>
                      <TableCell align="center">{row.Disease.Name}</TableCell>
                      <TableCell align="center">{row.Date}</TableCell>
                      <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

                      </TableRow>
    
        <TableRow>
        
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    
                  </TableHead>
                  <TableBody>
                  
                    {
                      <TableRow key={row.Cause}>
                        <TableCell className={classes.colorr} width="3.5%"></TableCell>
                        <TableCell className={classes.colorr} component="th" scope="row">
                        Cause :<br/><br/>
                        {row.Cause}
                        </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
                
              </Box>
              
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  className={classes.colorr}
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {refers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort() 
                .map((row, index) => {
                return (
                  <Row key={row.ReferID} row={row} />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={refers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />



<Box>

<Button

  component={RouterLink}

  to="/create"

  variant="contained"

  color="primary"

>

  Create User

</Button>
</Box>
    </Paper>

    
  );
}