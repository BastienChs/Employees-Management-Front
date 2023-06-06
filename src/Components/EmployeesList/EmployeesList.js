import { Component, useEffect, useState } from "react";
import dayjs from 'dayjs';
import axiosInstance from "../../axiosConfig";
import { Box, Button, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from "moment";
import { GetAllEmployees, AddEmployee, UpdateEmployee } from "../../API/Employee";
import { GetAllDepartments } from "../../API/Departments";

const EmployeesList = () => {

    const [openModalEmployee, setOpenModalEmployee] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState({
        id: null,
        name: null,
        jobTitle: null,
        managerId: null,
        salary: null,
        commission: null,
        departmentId: null,
        hireDate: null,
    }); // [id, name, manager, hireDate]
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        populateEmployeesData();
        populateDepartmentsData();
    }, [])

    //useEffect(() => {
    //    renderEmployeesTable(employees);
    //}, [employees])

    const populateEmployeesData = async () => {
        setLoading(true);
        const response = await GetAllEmployees();
        setEmployees(response.data);
        setLoading(false);
    };

    const populateDepartmentsData = async () => {
        setLoading(true);
        const response = await GetAllDepartments();
        setDepartments(response.data);
        setLoading(false);
    };

    const submitEmployeeForm = async () => {
        console.log('Save employee clicked');
        if (selectedEmployee.id != null) {
            //Update employee
            console.log('Update employee');
            const response = await UpdateEmployee(selectedEmployee);
            console.log(response);
            if (response.status === 201) {
                console.log('Employee updated successfully');
                setOpenModalEmployee(false);
                populateEmployeesData();
            }
        } else {
            //Add employee
            console.log('Add employee');
            const response = await AddEmployee(selectedEmployee);
            console.log(response);
            if (response.status === 201) {
                console.log('Employee added successfully');
                setOpenModalEmployee(false);
                populateEmployeesData();
            }
        }
    }
            

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
                return departments && departments.find(d => d.id === params.row.departmentId).name;
            }
        },
    ];

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
        console.log(params);
        setOpenModalEmployee(true);

        //We want to assign the selected employee to the state when the row is clicked, we have the id of the row in params.id, so we can find the employee in the employees array
        let employee = employees.find(e => e.id === params.id);
        console.log(employee);
        //setSelectedEmployee(employee);
        setSelectedEmployee({
            id: employee.id,
            name: employee.name,
            jobTitle: employee.jobTitle,
            managerId: employee.managerId,
            salary: employee.salary,
            commission: employee.commission,
            departmentId: employee.departmentId,
            hireDate: employee.hireDate,
        });
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

    const resetSelectedEmployeeData = () => {
        setSelectedEmployee({
            id: null,
            name: null,
            jobTitle: null,
            managerId: null,
            salary: null,
            commission: null,
            departmentId: null,
            hireDate: null,
        });
    }

    const handleNewEmployeeClick = () => {
        setOpenModalEmployee(true);
        resetSelectedEmployeeData();
    }



    let modalEditEmployee = !loading && selectedEmployee &&
            <Modal
                open={openModalEmployee}
                onClose={() => setOpenModalEmployee(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                {selectedEmployee.id && (
                    <Typography id="modal-modal-title" style={{ width: '100%', textAlign: 'left', fontSize: '12px', color: 'grey' }}>
                        Ref: {selectedEmployee.id}
                    </Typography>
                )}
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Name" variant="outlined" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})} />
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Hire date"
                            value={dayjs(selectedEmployee.hireDate)}
                            onChange={(newValue) => setSelectedEmployee({ ...selectedEmployee, hireDate: newValue })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Job title" variant="outlined" value={selectedEmployee.jobTitle} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, jobTitle: e.target.value })} />
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <InputLabel id="modal-manager-label">Manager</InputLabel>
                    <Select
                        labelId="modal-manager-label"
                        id="modal-manager-label"
                        value={selectedEmployee.managerId}
                        label="Manager"
                        onChange={(e) => setSelectedEmployee({...selectedEmployee, managerId: e.target.value})}
                    >
                        {
                            employees && employees.map((employee) => {
                                return <MenuItem value={employee.id}
                                    key={employee.id}>{employee.name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Salary" variant="outlined" value={selectedEmployee.salary} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, salary: e.target.value })} />
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <TextField label="Commision" variant="outlined" value={selectedEmployee.commission} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, commission: e.target.value })} />
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <InputLabel id="modal-department-label">Department</InputLabel>
                    <Select
                        labelId="modal-department-label"
                        id="modal-department-select"
                        value={selectedEmployee.departmentId}
                        label="Department"
                        onChange={(e) => setSelectedEmployee({...selectedEmployee, departmentId: e.target.value})}
                    >
                        {
                            departments && departments.map((department) => {
                                return <MenuItem value={department.id}
                                    key={department.id}>{department.name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={styleInput}>
                    <Button variant="contained" color="primary" onClick={() => submitEmployeeForm()}>
                       Save
                    </Button>
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
            <Button variant="contained" color="primary" onClick={() => handleNewEmployeeClick()} sx={{marginBottom: '1%', textAlign: 'right'}}>
                Add new employee
            </Button>
            {contents}
        </div>
    )

}

export default EmployeesList;
