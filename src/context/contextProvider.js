import React, { useEffect, useState } from 'react';
import Context from './createContext';
import { GetUsers } from '../apollo/fetch'

const ContextProvider = ({ children }) => {

    const [ users, setUsers ] = useState([]);
    const userData = GetUsers();

    useEffect(() => {
        if(userData){
            setUsers(userData.getAllUsers);
        }
    }, [ userData ]);


    return (

        <Context.Provider value={{ users }}>
        	{children}
        </Context.Provider>
    )
};

export default ContextProvider ;


