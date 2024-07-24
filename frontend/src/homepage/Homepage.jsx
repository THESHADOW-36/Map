import { Avatar, Box, Button, Grid, Skeleton, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { avatarLay, homepage, infoBoxContainer, infoBoxContent, infoBoxIcon, infoBoxLay, infoBoxText, mapInfoLay, searchBtnLg, searchBtnXs, searchCancelBtnLg, searchCancelBtnXs, searchLay, searchModeBtn, textField, travelModeBtn, travelModeLay } from './HomepageStyle'
import { AccessTime, Directions, DirectionsCar, DirectionsTransit, DirectionsWalk, HighlightOff, LocationOn, MyLocation, Search } from '@mui/icons-material';
import { Autocomplete, DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const Homepage = () => {

   // eslint-disable-next-line
   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
      libraries: ['places'],
   })

   const [map, setMap] = useState(null);
   const [directionResponse, setDirectionResponse] = useState(null);
   const [location, setLocation] = useState(null);
   const [distance, setDistance] = useState("");
   const [duration, setDuration] = useState("");
   const [travelMode, setTravelMode] = useState('DRIVING');
   const [searchMode, setSearchMode] = useState(true);
   const [fromInputValue, setFromInputValue] = useState("")

   const locationRef = useRef();
   const fromRef = useRef();
   const toRef = useRef();

   const center = { lat: 19.0330, lng: 73.0297 }
   const originLocation = {
      lat: directionResponse?.routes[0].legs[0].start_location.lat(),
      lng: directionResponse?.routes[0].legs[0].start_location.lng(),
   }

   const calculateRoute = async () => {
      if (!isLoaded || fromRef.current.value === "" || toRef.current.value === "") {
         return
      }

      const directionsService = new window.google.maps.DirectionsService()

      try {
         const result = await directionsService.route({
            origin: fromRef.current.value,
            destination: toRef.current.value,
            travelMode: window.google.maps.TravelMode[travelMode]
         })

         setDirectionResponse(result)
         setDistance(result.routes[0].legs[0].distance.text)
         setDuration(result.routes[0].legs[0].duration.text)
      } catch (error) {
         console.error('Directions request failed:', error);
      }
   }

   const markLocation = () => {
      if (!isLoaded || locationRef.current.value === "") {
         return
      }

      const geoCoder = new window.google.maps.Geocoder();
      geoCoder.geocode({ address: locationRef.current.value }, (result, status) => {
         if (status === "OK") {
            setLocation({ lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() })
         } else {
            console.log(status)
         }
      })
   }

   const clearRoute = () => {
      setDirectionResponse(null)
      setLocation(null);
      setDistance("")
      setDuration("")
      if (searchMode) {
         fromRef.current.value = ""
         toRef.current.value = ""
      } else {
         locationRef.current.value = ""
      }
   }

   const handleSearchMode = (value) => {
      setSearchMode(value)
      clearRoute()
   }

   useEffect(() => {
      if (fromRef.current?.value && toRef.current?.value) {
         calculateRoute();
      }
      // eslint-disable-next-line
   }, [travelMode]);

   useEffect(() => {
      setFromInputValue(fromRef.current?.value)
      // eslint-disable-next-line
   }, [fromRef.current?.value]);

   if (!isLoaded) {
      return <Skeleton variant="rectangular" width={210} />
   }
   return (
      <Box sx={homepage}>
         <Box width='100%'>
            <GoogleMap
               mapContainerStyle={{ width: '100%', height: '100%' }}
               center={location ? location : center}
               zoom={13}
               onLoad={(map) => setMap(map)}
            >
               {location && <Marker position={location} />}
               {directionResponse && <DirectionsRenderer directions={directionResponse} />}
            </GoogleMap>
         </Box>

         <Box sx={mapInfoLay}>
            <Box sx={searchLay}>
               {searchMode ?
                  <>
                     <Autocomplete>
                        <TextField sx={textField} label="From" variant="outlined" size="small" inputRef={fromRef} onChange={() => setFromInputValue(fromRef.current.value)} fullWidth />
                     </Autocomplete>
                     <Autocomplete>
                        <TextField sx={textField} label="To" variant="outlined" size="small" inputRef={toRef} fullWidth disabled={!fromInputValue} />
                     </Autocomplete>
                  </>
                  :
                  < Autocomplete >
                     <TextField sx={textField} label="Location" variant="outlined" size="small" inputRef={locationRef} fullWidth />
                  </Autocomplete>
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
                           <Button variant="contained" sx={searchBtnXs} fullWidth onClick={markLocation}><Search /></Button>
                           <Button variant="contained" sx={searchBtnLg} fullWidth onClick={markLocation}>Search</Button>
                        </Grid>
                     </>
                  }

                  <Grid item xs={3} container justifyContent="flex-end">
                     <Button variant="contained" sx={searchModeBtn} onClick={() => map.panTo(directionResponse ? originLocation : location)} fullWidth><MyLocation fontSize='small' /></Button>
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
                        <Typography sx={infoBoxText}>{distance ? distance : '0 km'}</Typography>
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
                        <Typography sx={infoBoxText}>{duration ? duration : '0 min'}</Typography>
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