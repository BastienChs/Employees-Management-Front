import { Component, useEffect, useState } from "react";
import dayjs from 'dayjs';
import axiosInstance from "../../axiosConfig";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from "moment";
import { GetAllEmployees, AddEmployee, UpdateEmployee } from "../../API/Employee";
import { GetAllDepartments } from "../../API/Departments";
import './style.css';

const EmployeesList = () => {

    const [openModalEmployee, setOpenModalEmployee] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [search, setSearch] = useState('');

    const [employees, setEmployees] = useState([]);
    const [employeesFiltered, setEmployeesFiltered] = useState([]);
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


    const populateEmployeesData = async () => {
        setLoading(true);
        const response = await GetAllEmployees();
        setEmployees(response.data);
        setEmployeesFiltered(response.data);
        setLoading(false);
    };

    const populateDepartmentsData = async () => {
        setLoading(true);
        const response = await GetAllDepartments();
        setDepartments(response.data);
        setLoading(false);
    };

    const validateForm = () => {
        if (selectedEmployee.name === null || selectedEmployee.name === '') {
            setError('Name is required');
            return false;
        }
        if (selectedEmployee.jobTitle === null || selectedEmployee.jobTitle === '') {
            setError('Job title is required');
            return false;
        }
        if (selectedEmployee.salary === null || selectedEmployee.salary === '') {
            setError('Salary is required');
            return false;
        }
        if (selectedEmployee.departmentId === null || selectedEmployee.departmentId === '') {
            setError('Department is required');
            return false;
        }
        if (selectedEmployee.hireDate === null || selectedEmployee.hireDate === '') {
            setError('Hire date is required');
            return false;
        }
        return true;
    }

    const submitEmployeeForm = async () => {
        if (!validateForm()) {
            return;
        }

        if (selectedEmployee.id != null) {
            //Update employee
            const response = await UpdateEmployee(selectedEmployee);
            if (response.status === 201) {
                setSuccess('Employee updated successfully');
                setOpenModalEmployee(false);
                populateEmployeesData();
            }
        } else {
            //Add employee
            const response = await AddEmployee(selectedEmployee);
            if (response.status === 201) {
                setSuccess('Employee added successfully');
                setOpenModalEmployee(false);
                populateEmployeesData();
            }
        }
    }


    //Definition of our datatable columns
    const columnsTest = [
        { field: 'id', headerName: 'ID', headerClassName: 'employee-datagrid-header',  flex: 1,
            cellClassName: (params) => {
                return 'shared-datagrid-column';
            }
        },
        { field: 'name', headerName: 'Name', headerClassName: 'employee-datagrid-header',  flex: 1,
            cellClassName: (params) => {
                return 'shared-datagrid-column';
            }
        },
        {
            field: 'manager', headerName: 'Manager', headerClassName: 'employee-datagrid-header',  flex: 1,
            valueGetter: (params) => {
                return params.row.manager != null ? params.row.manager.name : null;
            },
            //We want to apply the style to all cells without condition
            cellClassName: (params) => {
                return 'shared-datagrid-column manager-datagrid-column';
            }
        },
        {
            field: 'hireDate', headerName: 'Hire Date', headerClassName: 'employee-datagrid-header',  flex: 1,
            valueFormatter: (params) => {
                return params.value != null ? moment(params.value).format("DD/MM/YYYY") : null;
            },
            cellClassName: (params) => {
                return 'shared-datagrid-column';
            }
        },
        {
            field: 'department', headerName: 'Department', headerClassName: 'employee-datagrid-header',  flex: 1,
            valueGetter: (params) => {
                return departments && departments.find(d => d.id === params.row.departmentId).name;
            },
            cellClassName: (params) => {
                return 'shared-datagrid-column';
            }
        },
    ];

    useEffect(() => {
        //When search changes, we want to filter the employees list
        if (search === '') {
            setEmployeesFiltered(employees);
        } else {
            //Search should be on every field, except hire date
            setEmployeesFiltered(employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search]);

    const renderEmployeesTable = (employees) => {
        return (
            <Grid container direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={2}>
                <Grid item xs={10}>
                    {/*We want the search field and the add employee button to be on the same row and also to have the same height, search input will be align left and button align right*/}
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1%' }}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" sx={{ background: 'white' }} onChange={(e) => setSearch(e.target.value)}/>
                        <Button variant="contained" color="primary" onClick={() => handleNewEmployeeClick()} sx={{ marginBottom: '1%', textAlign: 'right' }}>
                            Add new employee
                        </Button>
                    </Box>
                    <DataGrid
                        sx={{background: 'white', minHeight: '80vh', width: '100%'}}
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


    let errorAlert =
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>

    let successAlert =
        <Snackbar open={success !== null} autoHideDuration={6000} onClose={() => setSuccess(null)}>
            <Alert severity="success" sx={{ width: '100%' }}>
                {success}
            </Alert>
        </Snackbar>


    let contents = loading
        ? <CircularProgress />
        : renderEmployeesTable(employeesFiltered);

    return (

        <div style={{textAlign: "center"}} >
            <h1 id="tabelLabel" >Employees List</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {modalEditEmployee}
            {contents}
            {errorAlert}
            {successAlert}
        </div>
    )

}

export default EmployeesList;
