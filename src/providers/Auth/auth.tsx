import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import { CLIENT_ID, REDIRECT_URI } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User{
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData{
    user?: User;
    logInWithGoogle: () => void;
    signOut: () => void;
}

interface ParamsGoogle{
    access_token: string;
}

interface ResponseAuthGoogle{
    type: string;
    params: ParamsGoogle
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps{
    children: ReactNode;
}

const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User>()
    const [userStorageLoading, setUserStorageLoading] = useState(true)
    const userKey = '@gofinance:user'

    const logInWithGoogle = async () => {
        const RESPONSE_TYPE = 'token';
        const SCOPE = encodeURI('profile email');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
        try {
            const { type, params } = await AuthSession.startAsync({ authUrl }) as ResponseAuthGoogle
            
            if(type === 'success' ){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
                const userInfo = await response.json()
                const userLogged = {
                    id: userInfo.id,
                    name: userInfo.given_name,
                    email: userInfo.email,
                    photo: userInfo.picture
                }
                setUser(userLogged)
                await AsyncStorage.setItem(userKey, JSON.stringify(userLogged))
            }
        } catch (error) {
            throw new Error(error as string)
        }
    }

    const signOut = async () => {
        setUser(undefined)
        await AsyncStorage.removeItem(userKey)
    }

    useEffect(() => {
      const getUserStorage = async () => {
        const userStorage = await AsyncStorage.getItem(userKey);
        if(userStorage){
            const userLogged = JSON.parse(userStorage) as User
            setUser(userLogged)
        }
        setUserStorageLoading(false)
      }
      getUserStorage()
    }, [])
    

    return(
        <AuthContext.Provider value={{
            user,
            logInWithGoogle,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    return context 
}

export { AuthProvider, useAuth}