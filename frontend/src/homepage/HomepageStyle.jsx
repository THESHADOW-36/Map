
export const homepage = {
   position: 'relative',
   width: '100%',
   height: '100vh',
   display: 'flex',
}

export const mapInfoLay = {
   background: { xs: 'transparent', md: 'rgb(220, 220, 220)' },
   position: { xs: 'absolute', md: 'static' },
   minWidth: { xs: '100%', md: '320px' },
   height: '100vh',
   display: 'flex',
   flexDirection: 'column',
   justifyContent: { xs: 'space-between', md: 'flex-start' },
   pointerEvents: 'none',
   zIndex: '100'
}

export const searchLay = {
   backgroundColor: { xs: 'rgba(128, 128, 128, 0.8)', md: 'rgb(220, 220, 220)' },
   padding: { xs: '18px 20px', md: '30px 20px' },
   pointerEvents: 'auto',
}

export const textField = {
   backgroundColor: 'white',
   marginBottom: { xs: '10px', md: '20px' },
}

export const searchModeBtn = {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   padding: '6px 0px',
}

export const searchBtnXs = {
   display: { xs: 'flex', md: 'none' },
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   padding: '6px 0px',
}

export const searchBtnLg = {
   display: { xs: 'none', md: 'flex' },
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   padding: '6px 0px',
}

export const searchCancelBtnXs = {
   display: { xs: 'flex', md: 'none' },
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   padding: '6px 0px',
}

export const searchCancelBtnLg = {
   display: { xs: 'none', md: 'flex' },
   alignItems: 'center',
   justifyContent: 'center',
   height: '100%',
   padding: '6px 0px',
}

export const travelModeLay = {
   backgroundColor: { xs: 'rgba(128, 128, 128, 0.8)', md: 'rgb(220, 220, 220)' },
   padding: { xs: '0px 0px 18px', md: '30px 0px' },
   pointerEvents: 'auto',
}

export const travelModeBtn = {
   display: 'flex',
   justifyContent: 'space-evenly',
   marginTop: { md: '30px' },
   padding: { md: '0px 20px' }
}

export const infoBoxContainer = {
   display: { xs: 'flex', md: 'block' }
}

export const infoBoxLay = {
   width: { xs: '45%', md: '80%' },
   height: { xs: '50px', md: '75px' },
   display: 'flex',
   alignItems: 'center',
   margin: 'auto',
   marginTop: '20px'
}

export const infoBoxContent = {
   backgroundColor: 'rgb(245, 245, 245)',
   border: '2px solid rgb(245, 245, 245)',
   width: '100%',
   height: '100%',
   marginRight: { xs: '-20px', md: '-50px' },
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   paddingRight: '50px'
}
export const infoBoxText = {
   fontSize: '18px',
   fontWeight: '600'
}

export const avatarLay = {
   border: '3px solid rgb(220, 220, 220)',
   backgroundColor: 'white',
   color: 'black',
   width: { xs: '50px', md: '80px' },
   height: '100%',
}

export const infoBoxIcon = {
   color: 'rgb(50, 50, 50)',
   fontSize: { xs: '36px', md: '46px' }
}