import {createContext, useEffect, useState} from 'react';
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;
export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, SetCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user") || null)
    )

    const login = (data)=> {
        // implement login process
        axios.post(apiUrl + "api/auth/login/", data)
            .then(response => {
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])
    return(
        <AuthContext.Provider value={{currentUser, login}}>
            {children}
        </AuthContext.Provider>
    )
}