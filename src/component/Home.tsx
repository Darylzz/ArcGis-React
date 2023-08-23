import './Map.css'
import './Home.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import Point from '@arcgis/core/geometry/Point'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material'



export default function Home() {
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [mapView, setMapView] = useState<MapView | null>(null)
    const [showAlert, setShowAlert] = useState<boolean>(false)

    useEffect(() => {
        const map: Map = new Map({
            basemap: 'streets-vector'
        })
        const newMapView: MapView = new MapView({
            map:map,
            container: 'viewDiv',
            center: [100,13],
            zoom: 5
        })
        setMapView(newMapView)
        newMapView.when(() => {
            newMapView.on('click',(event) => {
                const mapPoint = event?.mapPoint
                const point = new Point({
                    latitude: mapPoint?.latitude,
                    longitude: mapPoint?.longitude
                })
                const marker = new SimpleMarkerSymbol({
                    color: 'blue',
                    outline: {
                        color: 'tranparent',
                        width: 2
                    }
                })
                const graphic = new Graphic({
                    geometry: point,
                    symbol: marker
                })
                mapView?.graphics.add(graphic)
            })
        })
    }, [])

    function onChangeInputLatitude(event: React.ChangeEvent<HTMLInputElement>) {
        const newFloatLat = parseFloat(event.target.value)
        setLatitude(newFloatLat)
    }

    function onChangeInputLongitude(event: React.ChangeEvent<HTMLInputElement>) {
        const newFloatLong = parseFloat(event.target.value)
        setLongitude(newFloatLong)

    }

    function onNavigate() {
        if(latitude !== null && longitude !== null) {
            const point = new Point({
                latitude: latitude,
                longitude: longitude
            })
            const marker = new SimpleMarkerSymbol({
                color: 'blue',
                outline: {
                    color: 'tranparent',
                    width: 2
                }
            })
            const graphic = new Graphic({
                geometry: point,
                symbol: marker
            })
            mapView?.graphics.removeAll()
            mapView?.graphics.add(graphic)
            mapView?.goTo(point)
            setShowAlert(false)
        }
        else if(latitude === null && longitude === null) {
            setShowAlert(true)
        }
    }

    function onClearNavigate() {
        mapView?.graphics.removeAll()
        // setLatitude(null)
        // setLongitude(null)
        setShowAlert(false)
    }
    return <div className='flex'>
        <div className="panel">
            <div className="input-search">
            <TextField id="outlined-basic" label="Latitude" variant="outlined" fullWidth onChange={onChangeInputLatitude}/>
            <br />
            <TextField id="outlined-basic" label="Longitude" variant="outlined" fullWidth onChange={onChangeInputLongitude}/>
            <Button onClick={onNavigate}>Pin</Button>
            <Button onClick={onClearNavigate} color='error'>Clear pin</Button>
                {showAlert&& (
                <Alert severity='error' variant='filled'>
                    <AlertTitle>Error</AlertTitle>
                    Please fill in input latitude & longitude
                </Alert>

                )}
            </div>
        </div>
        <div id="viewDiv"></div>
    </div>
}