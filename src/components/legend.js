import { Box } from 'theme-ui'
import { Colorbar } from '@carbonplan/components'
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
    band,
    colormapReverse,
    evaluationMetric
  } = useRegionContext()



  const cm = useThemedColormap(colormapName)
  const colormap = colormapReverse ? [...cm].reverse() : cm

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

  const getMetric = (evaluationMetric) => {
    let metricLabel
    if (evaluationMetric === 'AE') metricLabel = 'Absolute Error'
    else if (evaluationMetric === 'RMSE') metricLabel = 'Root Mean Squared Error'
    else if (evaluationMetric === 'MAE') metricLabel = 'Mean Absolute Error'
    else if (evaluationMetric === 'MBE') metricLabel = 'Mean Bias Error'
    else metricLabel = evaluationMetric
    return `${metricLabel}`
  }


  return (

    <Box sx={{ ...sx, mb: 2 }}>
      <Colorbar
        colormap={colormap}
        units={getUnits(band)}
        label={getMetric(evaluationMetric)}
        clim={clim}
        setClim={setClim}
        horizontal
      />
    </Box>

  )
}

export default Legend