import axiosInstance from "../axiosConfig";

export async function GetAllEmployees() {
    try {
        const response = await axiosInstance.get('api/employee');
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function AddEmployee(employee) {
    try {
        console.log(employee);
        const response = await axiosInstance.post('api/employee', employee);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function UpdateEmployee(employee) {
    try {
        const response = await axiosInstance.patch('api/employee', employee);
        return response;
    } catch (error) {
        console.log(error);
    }
}