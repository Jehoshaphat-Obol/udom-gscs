import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
const apiUrl = import.meta.env.VITE_API_URL;

const login = (username, password) => {
    return axios.post(apiUrl + 'token/', {
        username,
        password
    })
    .then(response => {
        if(response.data.access){
            const decodedToken = jwtDecode(response.data.access);
            const user = {
                access: response.data.access,
                refresh: response.data.refresh,
                groups: decodedToken.groups,
                username: decodedToken.username || null,
                first_name: decodedToken.first_name || null,
                last_name: decodedToken.last_name || null,
                degree_level: decodedToken.degree_level || null,
                degree_program: decodedToken.degree_program || null,
                college: decodedToken.college || null,
                type: decodedToken.type || null,
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    })
    .catch(error => {
        return error;
    })
}

const logout = () => {
    localStorage.removeItem('user');
    location.href = '/auth/'
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user')) || null;
}

const refreshToken = async () => {
    const user = getCurrentUser();

    if(user && user.refresh){
        const response = await axios.post(apiUrl + 'token/refresh/', {refresh: user.refresh});
        if(response.data.access){
            user.access = response.data.access;
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data.access;
    }
    return null;
}

export default {
    login,
    logout,
    getCurrentUser,
    refreshToken
}