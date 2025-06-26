import { Box, IconButton } from 'theme-ui'
//import AnimateHeight from 'react-animate-height'
import { Search, X } from '@carbonplan/icons'
import DataDisplay from './data-display'
import ExpandingSection from './expanding-section'
import { useRecenterRegion } from '@carbonplan/maps'
import { XCircle } from '@carbonplan/icons'
import { useRegionContext } from './region'
import { SidebarFooter } from '@carbonplan/layouts'



export const RegionControls = () => {
  const { showRegionControls, setShowRegionControls, showRegionPicker, regionData, band, time } = useRegionContext()

  return (
    <SidebarFooter
      sx={{
        pt: [3],
        pb: [3],

      }}
    >
      <ExpandingSection
        label='Regional Stats'
        onClick={() => setShowRegionControls(!showRegionControls)}

      >
        <Box
          sx={{
            width: '100%',
            height: ['200px', '200px', '132px', '200px'],
            position: 'relative',


          }}
        >
          <DataDisplay />


        </Box>
      </ExpandingSection>
    </SidebarFooter>

  )
}
export default RegionControls

