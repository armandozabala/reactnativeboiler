import React, { createContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';

export interface PermissionState {
    locationStatus: PermissionStatus;
}

export const permissionInitState: PermissionState = {
    locationStatus: 'unavailable'
}

type PermissionsContextProps = {
    permissions: PermissionState;
    askLocationPermission: () => void;
    checkLocationPermission: () => void;
}

export const PermissionContext = createContext({} as PermissionsContextProps); //definit lo que exporta


export const PermissionsProvider = ({ children }: any) => {
    
    const [permissions, setPermissions] = useState(permissionInitState)

    useEffect(() => {

        checkLocationPermission();

        AppState.addEventListener('change', state => {
            
            console.log(state);

            if (state !== 'active') return;

            checkLocationPermission();

        });


    },[])


    const askLocationPermission = async () => {

        let permissionStatus: PermissionStatus;
        
        if (Platform.OS === 'ios') {
            permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
             permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        if (permissionStatus === 'blocked') {
            openSettings();
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        })

    }

    const checkLocationPermission = async () => {
        
        let permissionStatus: PermissionStatus;
        
        if (Platform.OS === 'ios') {
            permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
             permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        })


    }

  
    return (
        <PermissionContext.Provider value={{
            askLocationPermission,
            checkLocationPermission,
            permissions
        }}>
              {children}
        </PermissionContext.Provider>
    )

}