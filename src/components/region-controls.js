import { Box } from 'theme-ui'
import DataDisplay from './data-display'
import ExpandingSection from './expanding-section'
import { useRegionContext } from './region'
import { SidebarFooter } from '@carbonplan/layouts'



export const RegionControls = () => {
  const { showRegionControls, setShowRegionControls } = useRegionContext()

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

