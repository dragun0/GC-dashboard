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
  
/*
export const RegionControls = ({ sx }) => {
  const { showRegionPicker, regionData, setShowRegionPicker, band, time } = useRegionContext()

  return (
    
    <SidebarFooter onClick={() => setShowRegionPicker((v) => !v)} >
      <Box
        sx={{
          ...sx.heading,
          ...(showRegionPicker ? {} : { mb: 0 }),
          display: 'flex',
          alignItems: 'center', // Vertically center the content
          justifyContent: 'space-between', // Push content to the edges
          px: [1],
          gap: 2,
          cursor: 'pointer',
          mb: [0],
          
        }}
      >
        <Box>Regional Stats</Box>
        <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end', // Align the icon to the right
              position: 'relative',
              mt: '-1px',
            }}
        >
          {!showRegionPicker && (
            <Search
            sx={{
              strokeWidth: 2,
              width: '18px',
              color: 'secondary', // Default color
              transition: 'color 0.2s', // Smooth transition
              '&:hover': {
              color: 'primary', // Change to white on hover
              },
            }}
          />
          )}
          {showRegionPicker && 
          <X sx={{
            strokeWidth: 2,
            width: '16px',
            color: 'secondary', // Default color
            transition: 'color 0.2s', // Smooth transition
            '&:hover': {
            color: 'primary', // Change to white on hover
            },
          }}/>}
        </Box>
      </Box>

      */
      
      {/* Only render AnimateHeight when showRegionPicker is true */}

      /*

      {showRegionPicker && (
        <AnimateHeight
          duration={200}
          height={showRegionPicker ? 'auto' : 0}
          easing={'linear'}
          style={{ pointerEvents: 'none' }}
        >
          {regionData && !regionData.loading ? ( // delay rendering of DataDisplay until regionData is ready
            <Box sx={{ pt: [2], pb: [1], width: '100%', minHeight: '188px' }}>
              <DataDisplay />
            </Box>
          ) : ( 
            <Box sx={{ pt: [2], pb: [1], width: '100%', minHeight: '188px' }}>
              Loading region data...
            </Box>
          )}
          
        </AnimateHeight>
      )}
    </SidebarFooter>
    
  )
}

export default RegionControls

*/