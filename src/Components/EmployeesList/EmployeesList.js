import {Component, useEffect, useState} from "react";
import axiosInstance from "../../axiosConfig";
import { Box, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";
import { GetAllDepartments } from "../../API/Departments";

const EmployeesList = () => {

    const [openModalEmployee, setOpenModalEmployee] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // [id, name, manager, hireDate]
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        populateEmployeesData();
        populateDepartmentsData();
    }, [])

    const populateDepartmentsData = async () => {
        setLoading(true);
        const response = await GetAllDepartments();
        setDepartments(response.data);
        setLoading(false);
    };

    //Definition of our datatable columns
    const columnsTest = [
        { field: 'id', headerName: 'ID', flex: 1},
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'manager', headerName: 'Manager', flex: 1,
            valueGetter: (params) => {
                return params.row.manager != null ? params.row.manager.name : null;
            }
        },
        {
            field: 'hireDate', headerName: 'Hire Date', flex: 1,
            valueFormatter: (params) => {
                return params.value != null ? moment(params.value).format("DD/MM/YYYY") : null;
            }
        },
        {
            field: 'department', headerName: 'Department', flex: 1,
            valueGetter: (params) => {
                return departments.find(d => d.id === params.row.departmentId).name;
            }
        },
    ];

    const populateEmployeesData = () => {
        setLoading(true);
        axiosInstance.get('api/employee')
            .then((response) => {
                setEmployees(response.data);
                setLoading(false);

            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const renderEmployeesTable = (employees) => {
        return (
            <Grid container direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={2}>
                <Grid item xs={10}>
                    <DataGrid
                        sx={{background: 'white'}}
                        rows={employees}
                        columns={columnsTest}
                        onRowClick={handleRowClick}
                    />
                </Grid>
            </Grid>
        );
    }

    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        setOpenModalEmployee(true);

        //We want to assign the selected employee to the state when the row is clicked, we have the id of the row in params.id, so we can find the employee in the employees array
        let employee = employees.find(e => e.id === params.id);
        console.log(employee);
        setSelectedEmployee(employee);

        console.log('ID of the row clicked: ', params.id);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const styleInput = {
        marginTop: '5%',
    }


    let modalEditEmployee = !loading && selectedEmployee &&
            <Modal
                open={openModalEmployee}
                onClose={() => setOpenModalEmployee(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ width: '100%', textAlign: 'center' }}>
                    {selectedEmployee.name}#{selectedEmployee.id}
                </Typography>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Job title" variant="outlined" value={selectedEmployee.jobTitle}/>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <InputLabel id="modal-manager-label">Manager</InputLabel>
                    <Select
                        labelId="modal-manager-label"
                        id="modal-manager-label"
                        value={selectedEmployee.manager.id}
                        label="Manager"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Salary" variant="outlined" value={selectedEmployee.salary}/>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Commision" variant="outlined" value={selectedEmployee.comm}/>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <InputLabel id="modal-department-label">Department</InputLabel>
                    <Select
                        labelId="modal-department-label"
                        id="modal-department-select"
                        value={selectedEmployee.departmentId}
                        label="Department"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                </Box>
            </Modal>

    let contents = loading
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : renderEmployeesTable(employees);

    return (

        <div style={{textAlign: "center"}} >
            <h1 id="tabelLabel" >Employees List</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {modalEditEmployee}
            {contents}
        </div>
    )

}

export default EmployeesList;
