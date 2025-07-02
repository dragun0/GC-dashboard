import { Box } from 'theme-ui'
import { useRegionContext } from './region'
import BinnedSummary from './binned-summary'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useMemo } from 'react'

const INVALID_VALUE = 9.969209968386869e36

const DataDisplay = () => {

  const getUnits = (band) => {
    if (band === 'u10') return 'm/s'
    if (band === 't2m') return 'ºC'
    if (band === 'q') return 'g/kg'
    return band
  }

  const { band, time, regionData, colormapName, clim, evaluationMetric, colormapReverse } = useRegionContext()

  const cm = useThemedColormap(colormapName)
  const colormap = colormapReverse ? [...cm].reverse() : cm
  const value = regionData?.value

  // Memoize data extraction and filtering
  const filteredData = useMemo(() => {
    if (
      !value ||
      !value.climate ||
      !value.climate[band] ||
      !value.climate[band][time]
    ) {
      return null
    }
    return value.climate[band][time].filter((d) => d !== INVALID_VALUE)
  }, [value, band, time])



  if (!filteredData) {
    return 'Loading...'
  }

  if (filteredData.length === 0) {
    return 'No data available'
  }

  const area = value.climate[band][time]


  return (

    <Box
      sx={{
        transform: 'translateY(-22px)',
      }}
    >
      <BinnedSummary
        clim={clim}
        colormap={colormap}
        data={filteredData}
        area={area}
        label={
          evaluationMetric === 'AE'
            ? 'MAE'
            : evaluationMetric === 'RMSE'
              ? 'Average RMSE'
              : evaluationMetric === 'MAE'
                ? 'Average MAE'
                : evaluationMetric === 'MBE'
                  ? 'Average MBE'
                  : ''
        }
        units={getUnits(band)}
      />
    </Box>

  )
}

export default DataDisplay
