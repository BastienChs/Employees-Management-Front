import axiosInstance from "../axiosConfig";

export async function GetAllDepartments () {
    try {
        const response = await axiosInstance.get('api/Department');
        return response;
    } catch (error) {
        console.log(error);
    }
}