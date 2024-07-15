import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Autocomplete, Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material'
import { avatarLay, homepage, infoBoxContainer, infoBoxContent, infoBoxIcon, infoBoxLay, infoBoxText, mapInfoLay, searchBtnLg, searchBtnXs, searchCancelBtnLg, searchCancelBtnXs, searchLay, searchModeBtn, textField, travelModeBtn, travelModeLay } from './HomepageStyle'
import { AccessTime, Directions, DirectionsCar, DirectionsTransit, DirectionsWalk, HighlightOff, LocationOn, MyLocation, Search } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';


// import DeckGL from "@deck.gl/react";
// import StaticMap from "react-map-gl";
// import maplibregl from "maplibre-gl";
// import { Map as MapLibreMap, NavigationControl } from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";


const Homepage = () => {
   // const [mapReady, setMapReady] = useState(false);

   const [predictions, setPredictions] = useState([]);
   const [fromLocation, setFromLocation] = useState(null);
   const [toLocation, setToLocation] = useState(null);
   const [location, setLocation] = useState(null);
   const [travelMode, setTravelMode] = useState('DRIVING');
   const [searchMode, setSearchMode] = useState(true);
   const [distance, setDistance] = useState("");
   const [duration, setDuration] = useState("");
   const [route, setRoute] = useState([]);
   console.log(route.flat())

   const fromGeoCoder = fromLocation?.lat + '%2C' + fromLocation?.lng
   const toGeoCoder = toLocation?.lat + '%2C' + toLocation?.lng


   const center = [19.0330, 73.0297]
   const clearRoute = () => {
      setFromLocation(null)
      setToLocation(null)
      setLocation(null)
      setDistance("")
      setDuration("")
      setPredictions([]);
   }

   const handleSearchMode = (value) => {
      setSearchMode(value)
      // clearRoute()
   }

   const calculateRoute = async () => {
      if (toLocation === null || fromLocation === null) {
         return toast.error("Empty field")
      }

      try {

         const response = await axios.post(`https://api.olamaps.io/routing/v1/directions?origin=${fromGeoCoder}&destination=${toGeoCoder}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=58q7R2LaL3IlQ7BYkNKaZOlyJsJSuVtFos1MOYe3`);

         console.log("response.data.routes[0].legs[0].steps", response.data.routes[0].legs[0].steps)
         setRoute(response.data.routes[0].legs[0].steps.map((map) => ([[map.start_location?.lat, map.start_location?.lng], [map.end_location?.lat, map.end_location?.lng]])))
         setDistance(response.data.routes[0].legs[0].distance)
         setDuration(response.data.routes[0].legs[0].duration)
      } catch (error) {
         console.error('Directions request failed:', error);
      }
   }


   const handleAutocomplete = async (input, inputName) => {
      if (!input) return;

      try {
         const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
            params: {
               input: input,
               api_key: process.env.REACT_APP_MAP_API_KEY
            }
         });
         setPredictions(response.data.predictions);

      } catch (error) {
         console.error('Autocomplete request failed:', error);
      }
   }
   const handleSelectPrediction = (prediction, inputName) => {
      if (inputName === 'From') {
         setFromLocation(prediction?.geometry?.location);
      } else if (inputName === 'To') {
         setToLocation(prediction?.geometry?.location)
      } else if (inputName === 'Location') {
         setLocation(prediction?.geometry?.location)
      }
      setPredictions([]);
   };

   useEffect(() => {
      if (fromLocation && toLocation) {
         calculateRoute();
      }
      // eslint-disable-next-line
   }, [travelMode]);
   // useEffect(() => {
   //    if (!mapReady) return;

   //    const map = new MapLibreMap({
   //       container: "central-map",
   //       center: [0, 0],
   //       zoom: 0,
   //       style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
   //       transformRequest: (url, resourceType) => {
   //          url = url + `?api_key=${process.env.REACT_APP_MAP_API_KEY}`;
   //          return { url, resourceType };
   //       },
   //    });

   //    const nav = new NavigationControl({
   //       visualizePitch: true,
   //    });
   //    map.addControl(nav, "top-left");
   // }, [mapReady]);
   return (
      <Box sx={homepage}>
         <Box width='100%'>
            <MapContainer center={location ? location : center} zoom={13} style={{ zIndex: '1', height: '1000px', width: '100%' }}>
               <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               {location &&
                  <Marker position={location}></Marker>
               }
               <Polyline positions={route} color="blue" />
            </MapContainer>
            {/* <div
              style={{ width: "100%", height: "100vh", overflow: "hidden" }}
              ref={() => setMapReady(true)}
              id="central-map"
            /> */}
         </Box>

         <Box sx={mapInfoLay}>
            <Box sx={searchLay}>
               {searchMode ?
                  <>
                     {/* <Autocomplete>
                        <TextField sx={textField} label="From" variant="outlined" size="small" inputRef={fromRef} onChange={() => setFromInputValue(fromRef.current.value)} fullWidth />
                     </Autocomplete>
                     <Autocomplete>
                        <TextField sx={textField} label="To" variant="outlined" size="small" inputRef={toRef} fullWidth disabled={!fromInputValue} />
                     </Autocomplete> */}

                     <Autocomplete
                        sx={textField}
                        id="autocomplete-from-loc-input"
                        options={predictions}
                        getOptionLabel={(option) => option.description}
                        onInputChange={(event, newValue) => handleAutocomplete(newValue, 'From')}
                        renderInput={(params) => <TextField {...params} label="From" variant="outlined" size="small" fullWidth />}
                        onChange={(event, value) => handleSelectPrediction(value, 'From')}
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
                           <Button variant="contained" sx={searchBtnXs} fullWidth ><Search /></Button>
                           <Button variant="contained" sx={searchBtnLg} fullWidth >Search</Button>
                        </Grid>
                     </>
                  }

                  <Grid item xs={3} container justifyContent="flex-end">
                     <Button variant="contained" sx={searchModeBtn} fullWidth><MyLocation fontSize='small' /></Button>
                  </Grid>
                  <Grid item xs={3} md={12}>
                     <Button variant="contained" sx={searchCancelBtnXs} color="error" fullWidth onClick={clearRoute}><HighlightOff /></Button>
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
                        <Typography sx={infoBoxText}>{distance ? distance : 0} M</Typography>
                     </Box>
                     <Avatar sx={avatarLay}>
                        {/* <i className="fa-solid fa-car-side fa-xl"></i> */}
                        {travelMode === "DRIVING" && <DirectionsCar fontSize='large' />}
                        {travelMode === "TRANSIT" && <DirectionsTransit fontSize='large' />}
                        {travelMode === "WALKING" && <DirectionsWalk fontSize='large' />}
                     </Avatar>
                  </Box>

                  <Box sx={infoBoxLay}>
                     <Box sx={infoBoxContent} borderRadius={2}>
                        <Typography sx={infoBoxText}>{duration ? duration : 0} Mins</Typography>
                     </Box>
                     <Avatar sx={avatarLay}>
                        <AccessTime sx={infoBoxIcon} />
                     </Avatar>
                  </Box>
               </Box>
            </Box>
         </Box>
      </Box >
   )
}

export default Homepage