import { Box, Flex } from 'theme-ui'
import { Group, Colorbar } from '@carbonplan/components'
import { useRegionContext } from '../components/region'
import { useThemedColormap } from '@carbonplan/colormaps'

const sx = {
  fontFamily: 'mono',
  fontSize: ['9px', 0, 0, 1],
  letterSpacing: 'smallcaps',
  textTransform: 'uppercase',
}

const Legend = () => {
  const {
      clim,
      setClim,
      colormapName,
      band
    } = useRegionContext()

//    const colormap = useThemedColormap('warm')

    const colormap = useThemedColormap(colormapName)

    const getUnits = (band) => {
        if (band === 'u10') {
          return '(m/s)'
        } else if (band === 't2m') {
          return '(ºC)'
        } else if (band === 'q') {
          return '(g/kg)'
        } 
        else {
          return band // Default to the band value if no match
        }
      }
    


  return (

    <Box sx={{ ...sx, mb: 2 }}>
      <Colorbar
      colormap={colormap} 
      units={getUnits(band)}
      label={'Absolute Error'}
      clim={clim}
      setClim={setClim}
      horizontal
    />
  </Box>
    
  )
}

export default Legend