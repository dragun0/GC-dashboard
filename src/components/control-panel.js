import { Box, Container, Divider } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { useState } from 'react'
import { Column, Row, getScrollbarWidth } from '@carbonplan/components'
import { Sidebar, SidebarFooter, SidebarHeader } from '@carbonplan/layouts'
import RegionControls from './region-controls'
import { useRegionContext } from './region'
import TimeSlider from './time-slider'
import TimeSeries from './time-series'

//import Statistics from '../components/statistics'


const sx = {
  heading: {
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
  },
  description: {
    fontSize: [1, 1, 1, 2],
  },
  label: {
    fontFamily: 'faux',
    letterSpacing: 'smallcaps',
    fontSize: [2, 2, 2, 3],
    mb: [2],
  },
}

const useScrollbarClasses = () => {
  const [customScrollbar] = useState(
    () => document && getScrollbarWidth(document) > 0
  )

  return customScrollbar ? 'custom-scrollbar' : null
}

const ControlPanel = ({ expanded, setExpanded, children }) => {
const embedded = false
const { setShowRegionControls, setShowTimeSeries, setShowRegionPicker, showRegionPicker } = useRegionContext()
  const className = useScrollbarClasses()
  const index = useBreakpointIndex({ defaultIndex: 2 })
  //console.log('className:', className)

  /*
  if (embedded) {
    return (
      console.log('className:', className),
      <Box
      //className= "custom-scrollbar"
        sx={{
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'all' : 'none',
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          minWidth: '0px',
          maxHeight: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          overflowY: 'scroll',
          backgroundColor: 'background',
          zIndex: 4000,
          pt: ['56px'],
          transition: 'opacity 0.25s',
        }}
      >
        <Container>
          <Row>
            <Column start={[1]} width={[12]}>
              <Divider />
  
              <Box
                sx={{
                  display: expanded ? 'inherit' : 'none',
                  mt: [4],
                }}
              >
                {expanded && children}
              </Box>
            </Column>
          </Row>
        </Container>
      </Box>
    )
  } else 
  */
  
  if (index < 2) {
   // console.log('className:', className)
    return (
      <Box
        className= {className} //"custom-scrollbar"//
        sx={{
          overflowX: 'hidden',
          overflowY: 'scroll',
          height: 'calc(100%)',
          position: 'fixed',
          width: 'calc(100vw)',
          top: '0px',
          mt: ['56px'],
          pb: '56px',
          pt: [5],
          bg: 'background',
          zIndex: 1100,
          borderStyle: 'solid',
          borderColor: 'muted',
          borderWidth: '0px',
          borderBottomWidth: '1px',
          transition: 'transform 0.15s',
          ml: [-3, -4, -5, -6],
          pl: [3, 4, 5, 6],
          pr: [3, 4, 5, 6],
          transform: expanded ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <Row>
          <Column start={[1, 1, 1, 1]} width={[6, 8, 10, 10]}>
            {children}
          </Column>
        </Row>
      </Box>
    )
  } else {
  
  

    return (

      <Box
        className= {className} //-> "custom-scrollbar"
        sx={{
          overflowX: 'hidden',
          overflowY: 'scroll',
        
        }}
      >
      
      <Sidebar 
      
        expanded={expanded}
        setExpanded={setExpanded}
        tooltip='Data controls'
        side='left'
        width={4}
        onClose={() => {
          setShowRegionControls(false)
          setShowTimeSeries(false)
        }}
        //onClose={() => regionControlsProps.setShowRegionPicker(false)}
      

        footer={

          <> 

          <RegionControls />

          <TimeSeries  /> 

          <TimeSlider/> 

          
          </>
        }
      >
        
        
        {children}
      </Sidebar>
      </Box>
    )
  }

}


export default ControlPanel

// <RegionControls {...regionControlsProps} />

/*
{expanded && (
            <PlayButtonDateTime
              time={time}
              setTime={setTime}
              max={40}
              delay={200}
              pause = 'max'
            />
            )
          }
*/