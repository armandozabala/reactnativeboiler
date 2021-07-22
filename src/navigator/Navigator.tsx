import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from '../screens/MapScreen';
import { PermissionScreen } from '../screens/PermissionScreen';
import { useContext } from 'react';
import { PermissionContext } from '../context/PermissionsContext';
import { Loading } from '../components/Loading';

const Stack = createStackNavigator();

export const Navigator = () => {


  const { permissions } = useContext(PermissionContext);

  if (permissions.locationStatus === 'unavailable') {
    return <Loading/>
  }

  return (
      <Stack.Navigator
          screenOptions={{
              headerShown: false,
              cardStyle: {
                  backgroundColor: 'white'
              }
         }}
    >
      
      {
        (permissions.locationStatus === 'granted') ? (
            <Stack.Screen name="MapScreen" component={MapScreen} />
        ) : (
            <Stack.Screen name="PermissionScreen" component={PermissionScreen} />
         )
      }

   
    </Stack.Navigator>
  );
}