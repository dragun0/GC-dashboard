import { Box } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { useState } from 'react'
import { Column, Row, getScrollbarWidth } from '@carbonplan/components'
import { Sidebar } from '@carbonplan/layouts'
import RegionControls from './region-controls'
import { useRegionContext } from './region'
import TimeSlider from './time-slider'
import TimeSeries from './time-series'


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


  if (index < 2) {
    return (
      <Box
        className={className} //"custom-scrollbar"//
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
        className={className} //-> "custom-scrollbar"
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

              <TimeSeries />

              <TimeSlider />


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
