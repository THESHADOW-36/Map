import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Autocomplete, Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { avatarLay, homepage, infoBoxContainer, infoBoxContent, infoBoxIcon, infoBoxLay, infoBoxText, mapInfoLay, searchBtnLg, searchBtnXs, searchCancelBtnLg, searchLay, searchModeBtn, textField, travelModeBtn, travelModeLay } from './HomepageStyle';
import { AccessTime, Directions, DirectionsCar, DirectionsTransit, DirectionsWalk, LocationOn, MyLocation, Search } from '@mui/icons-material';

import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

import * as maptilersdk from '@maptiler/sdk';
import { decodePolyline } from '../utils/decodePolyline';
import { getBounds } from '../utils/calculatebounds';

const Homepage = () => {
   const [onelocation, setonelocation] = useState('')
   const [predictions, setPredictions] = useState([]);
   const [location, setLocation] = useState(null);
   const [fromLocation, setFromLocation] = useState(null);
   const [toLocation, setToLocation] = useState(null);
   const [travelMode, setTravelMode] = useState('DRIVING');
   const [searchMode, setSearchMode] = useState(true);
   const [distance, setDistance] = useState("");
   const [duration, setDuration] = useState("");
   const [route, setRoute] = useState([]);
   const [markers, setMarkers] = useState({ from: null, to: null });
   // console.log(route[0][0])

   const mapContainer = useRef(null);
   const map = useRef(null);
   maptilersdk.config.apiKey = 'o80P0bXGur9l8vrfOHHN';



   const fromGeoCoder = fromLocation?.lat + '%2C' + fromLocation?.lng
   const toGeoCoder = toLocation?.lat + '%2C' + toLocation?.lng

   const center = [73.0297, 19.0330]
   const mapCenteringCord = fromLocation ? [fromLocation.lng, fromLocation.lat] : center

   const handleSearchMode = (value) => {
      setSearchMode(value);
   };

   const calculateRoute = async () => {
      if (!fromLocation || !toLocation) {
         return toast.error("Please select both 'From' and 'To' locations.");
      }

      try {

         const response = await axios.post(`https://api.olamaps.io/routing/v1/directions?origin=${fromGeoCoder}&destination=${toGeoCoder}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=58q7R2LaL3IlQ7BYkNKaZOlyJsJSuVtFos1MOYe3`);

         const decodedRoute = decodePolyline(response.data.routes[0].overview_polyline);
         setRoute(decodedRoute.map(point => [point.lng, point.lat]));

         const distance = response.data.routes[0].legs[0].distance;
         const distanceInKm = (distance / 1000).toFixed(2);
         setDistance(`${distanceInKm} KM`);

         const durationInSeconds = response.data.routes[0].legs[0].duration;
         const hours = Math.floor(durationInSeconds / 3600);
         const minutes = Math.floor((durationInSeconds % 3600) / 60);
         setDuration(`${hours} Hrs ${minutes} Mins`);

         Marker();

         const bounds = getBounds(decodedRoute.map(point => [point.lng, point.lat]));
         console.log("bounds :", bounds)
         if (map.current) {
            map.current.fitBounds(bounds, { padding: 50 });
         }

      } catch (error) {
         console.error('Directions request failed:', error);
      }
   };

   const singlelocation = async () => {
      try {
         const response = await axios.get(`https://api.olamaps.io/places/v1/geocode`, {
            params: {
               address: 'thane',
               language: 'English',
               api_key: '58q7R2LaL3IlQ7BYkNKaZOlyJsJSuVtFos1MOYe3'
            }
           
         });
         console.log(response)
         setonelocation(response.data.onelocation)
      } catch (error) {
         console.log('Single location not found', error);
      }
   };
  
   const handleAutocomplete = async (input) => {
      console.log("onInputChange ===> handleAutocomplete")


      if (!input) return;

      try {
         const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
            params: {
               input: input,
               api_key: process.env.REACT_APP_OLA_MAP_API_KEY
            }
         });
         setPredictions(response.data.predictions);
         console.log(response)

      } catch (error) {
         console.error('Autocomplete request failed:', error);
      }
   }

   const handleSelectPrediction = (prediction, inputName) => {
      console.log("onChange ===> handleSelectPrediction:")
      if (inputName === 'From') {
         setFromLocation(prediction?.geometry?.location);
      } else if (inputName === 'To') {
         setToLocation(prediction?.geometry?.location);
      } else if (inputName === 'Location') {
         setLocation(prediction?.geometry?.location);
      }
      setPredictions([]);
   };

   const maptiler = () => {
      if (map.current) return;
      map.current = new maptilersdk.Map({
         container: mapContainer.current,
         zoom: 12,
         center: mapCenteringCord,
         style: "streets-v2"
      });

      map.current.on('load', async () => {
         map.current.addSource('route', {
            type: 'geojson',
            data: {
               type: 'Feature',
               properties: {},
               geometry: {
                  type: 'LineString',
                  coordinates: []
               }
            }
         });

         map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
               'line-join': 'round',
               'line-cap': 'round'
            },
            paint: {
               'line-color': '#3887be',
               'line-width': 5,
               'line-opacity': 0.75
            }
         });
      });
   }

   const Marker = () => {
      if (fromLocation) {
         if (markers.from) {
            markers.from.remove();
         }
         const markerFrom = new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([fromLocation.lng, fromLocation.lat])
            .addTo(map.current);
         setMarkers(prevMarkers => ({ ...prevMarkers, from: markerFrom }));
      }

      if (toLocation) {
         if (markers.to) {
            markers.to.remove();
         }
         const markerTo = new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([toLocation.lng, toLocation.lat])
            .addTo(map.current);
         setMarkers(prevMarkers => ({ ...prevMarkers, to: markerTo }));
      }
   }

   const clearRoute = () => {
      setFromLocation(null);
      setToLocation(null);
      setLocation(null);
      setDistance("");
      setDuration("");
      setFromLocation(null);
      setToLocation(null);
      setLocation(null);
      setDistance("");
      setDuration("");
      setPredictions([]);
      setRoute([]);

      if (map.current) {

         if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
         }
         if (map.current.getSource('route')) {
            map.current.removeSource('route');
         }

         if (markers.from) {
            markers.from.remove();
            markers.from = null;
         }
         if (markers.to) {
            markers.to.remove();
            markers.to = null;
         }
      }
   };
   console.log("mapContainer:", mapContainer)
   useEffect(() => {
      if (fromLocation && toLocation) {
         calculateRoute();
       
      }
      maptiler()
   }, [fromLocation, toLocation]);

   useEffect(() => {
      if (route.length > 0 && map.current) {
         map.current.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
               type: 'LineString',
               coordinates: route
            }
         });

         const bounds = getBounds(route);
         map.current.fitBounds(bounds, { padding: 50 });

      }
   }, [route]);

   return (
      <Box sx={homepage}>
         <Box>
         </Box>
         <Box width="100%" height="100%" ref={mapContainer} />
         <Box sx={mapInfoLay}>
            <Box sx={searchLay}>
               {searchMode ?
                  <>
                     <Autocomplete
                        sx={textField}
                        id="autocomplete-from-loc-input"
                        options={predictions}
                        getOptionLabel={(option) => option.description}
                        onInputChange={(event, newValue) => handleAutocomplete(newValue, 'From')}
                        renderInput={(params) => <TextField {...params} label="From" variant="outlined" size="small" fullWidth />}
                        onChange={(event, value) => handleSelectPrediction(value, 'From')}
                        clearOnEscape
                     />
                     <Autocomplete
                        sx={textField}
                        id="autocomplete-to-loc-input"
                        options={predictions}
                        getOptionLabel={(option) => option.description}
                        onInputChange={(event, newValue) => handleAutocomplete(newValue, 'To')}
                        renderInput={(params) => <TextField {...params} label="To" variant="outlined" size="small" fullWidth />}
                        onChange={(event, value) => handleSelectPrediction(value, 'To')}
                     />
                  </>
                  :
                  <Autocomplete
                     sx={textField}
                     id="autocomplete-loc-input"
                     options={predictions}
                     getOptionLabel={(option) => option.description}
                     onInputChange={(event, newValue) => handleAutocomplete(newValue, 'Location')}
                     renderInput={(params) => <TextField {...params} label="Location" variant="outlined" size="small" fullWidth />}
                     onChange={(event, value) => handleSelectPrediction(value, 'Location')}
                  />
               }

               <Grid container spacing={2}>
                  {searchMode ?
                     <>
                        <Grid item xs={3}>
                           <Button variant="contained" sx={searchModeBtn} onClick={() => handleSearchMode(false)} fullWidth><LocationOn fontSize='small' /></Button>
                        </Grid>
                        <Grid item xs={3} md={6} container justifyContent="center">
                           <Button variant="contained" sx={searchBtnXs} fullWidth onClick={calculateRoute}><Search /></Button>
                           <Button variant="contained" sx={searchBtnLg} fullWidth onClick={calculateRoute}>Search</Button>

                        </Grid>
                     </>
                     :
                     <>
                        <Grid item xs={3}>
                           <Button variant="contained" sx={searchModeBtn} onClick={() => handleSearchMode(true)} fullWidth><Directions /></Button>
                        </Grid>
                        <Grid item xs={3} md={6} container justifyContent="center">
                           <Button variant="contained" sx={searchBtnXs} fullWidth><Search /></Button>
                           <Button variant="contained" sx={searchBtnLg} onClick={singlelocation} fullWidth>Search</Button>
                        </Grid>
                     </>
                  }

                  <Grid item xs={3} container justifyContent="flex-end">
                     <Button variant="contained" sx={searchModeBtn} fullWidth><MyLocation fontSize='small' /></Button>
                  </Grid>
                  <Grid item xs={3} md={12}>
                     <Button variant="contained" sx={searchCancelBtnLg} color="error" fullWidth onClick={clearRoute}>Cancel</Button>
                  </Grid>
               </Grid>
            </Box>

            <Box sx={travelModeLay}>
               <Box sx={travelModeBtn}>
                  <Button variant='contained' sx={{ margin: '0px 2px' }} fullWidth onClick={() => setTravelMode('DRIVING')}><DirectionsCar /></Button>
                  <Button variant='contained' sx={{ margin: '0px 2px' }} fullWidth onClick={() => setTravelMode('TRANSIT')}><DirectionsTransit /></Button>
                  <Button variant='contained' sx={{ margin: '0px 2px' }} fullWidth onClick={() => setTravelMode('WALKING')}><DirectionsWalk /></Button>
               </Box>

               <Box sx={infoBoxContainer}>
                  <Box sx={infoBoxLay}>
                     <Box sx={infoBoxContent} borderRadius={2}>
                        <Typography sx={infoBoxText}>{distance ? distance : 0}</Typography>
                     </Box>
                     <Avatar sx={avatarLay}>
                        {travelMode === "DRIVING" && <DirectionsCar fontSize='large' />}
                        {travelMode === "TRANSIT" && <DirectionsTransit fontSize='large' />}
                        {travelMode === "WALKING" && <DirectionsWalk fontSize='large' />}
                     </Avatar>
                  </Box>

                  <Box sx={infoBoxLay}>
                     <Box sx={infoBoxContent} borderRadius={2}>
                        <Typography sx={infoBoxText}>{duration ? duration : 0}</Typography>
                     </Box>
                     <Avatar sx={avatarLay}>
                        <AccessTime sx={infoBoxIcon} />
                     </Avatar>
                  </Box>
               </Box>
            </Box>
         </Box>
      </Box>
   );
};

export default Homepage;

