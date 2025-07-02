import { Box } from 'theme-ui'
import { Colorbar } from '@carbonplan/components'

const sx = {
  fontFamily: 'mono',
  fontSize: ['9px', 0, 0, 1],
  letterSpacing: 'smallcaps',
  textTransform: 'uppercase',
}

const Legend = (props) => {
  const {
    clim,
    setClim,
    selectedVariable,
    colormap,

  } = props





  const getUnits = (selectedVariable) => {
    if (selectedVariable === 'u10') {
      return '(m/s)'
    } else if (selectedVariable === 'v10') {
      return '(m/s)'
    }
    else if (selectedVariable === 'msl') {
      return '(hPa)'
    }
    else if (selectedVariable === 't2m') {
      return '(ºC)'
    } else if (selectedVariable === 'q') {
      return '(g/kg)'
    }
    else {
      return selectedVariable // Default to the var value if no match
    }
  }




  return (

    <Box sx={{ ...sx, mb: 2 }}>
      <Colorbar
        colormap={colormap}
        label={getUnits(selectedVariable)}
        clim={clim}
        setClim={setClim}
        horizontal
      />
    </Box>

  )
}

export default Legend




