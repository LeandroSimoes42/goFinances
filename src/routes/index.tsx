
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthRoutes from './auth.routes';
import { useAuth } from '../providers/Auth/auth';
import AppRoutes from './index.routes';

const Routes = () => {
    const { user } = useAuth()
    return(
        <NavigationContainer>
            { user ? <AppRoutes/> :<AuthRoutes/> }
        </NavigationContainer>
    )
}

export default Routes