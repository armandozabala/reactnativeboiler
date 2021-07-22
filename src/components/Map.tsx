import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation';
import { Fab } from './Fab';
import { Loading } from './Loading';

export const Map = () => {

    const { hasLocation, routesLines, userLocation, stopFollowUserLocation, initialPosition, getCurrentLocation, followUserLocation } = useLocation()

    const mapViewRef = useRef<MapView>();
    const following = useRef<boolean>(false);

    const [showPolyline, setShowPolyline] = useState(false)

    useEffect(() => {
        followUserLocation();
        return () => {
            stopFollowUserLocation();
        }
    },[])

    useEffect(() => {
        const { latitude, longitude } = userLocation;

        if (!following.current) return;
        
        mapViewRef.current?.animateCamera({
            center: {
                latitude,
                longitude
            }
        })
    },[userLocation])

    const getCenterPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

        following.current = true;

        mapViewRef.current?.animateCamera({
            center: {
                latitude,
                longitude
            }
        })
    }

    if (!hasLocation) {
        return <Loading/>
    }

    return (
        <>
            <MapView
                ref={ (el) => mapViewRef.current = el!}
                style={{ flex: 1 }}
               
                initialRegion={{
                    latitude: initialPosition!.latitude,
                    longitude: initialPosition!.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onTouchStart={ () => following.current = false }
            >

                <Polyline
                    coordinates={routesLines}
                    strokeColor="black"
                    strokeWidth={3}
                />
             <Marker
                coordinate={userLocation}  
                description="hola"
                />
         
            </MapView>
               <Fab
                iconName="compass-outline"
                onPress={getCenterPosition}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }}
            />
      </>
    )
}
