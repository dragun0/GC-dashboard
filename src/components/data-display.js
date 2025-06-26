import { Box } from 'theme-ui'
import { useRegionContext } from './region'
import BinnedSummary from './binned-summary'
import { color } from '@carbon/charts'
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

  const { band, time, regionData, colormapName, clim, evaluationMetric } = useRegionContext()
  const colormap = useThemedColormap(colormapName)
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
    // Only log once for missing data
    // console.error('Region data is invalid or missing:', regionData)
    return 'Loading...'
  }

  if (filteredData.length === 0) {
    // console.error('Data is invalid or empty:', filteredData)
    return 'No data available'
  }

  //const area = filteredData.length // Example: count of valid grid cells

  //console.log('Data in display:', data)
  //console.log('value:', value)
  //console.log('value.climate:', value.climate)
  //console.log('Data in display:', )

  //const area = filteredData.length
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
              ? 'RMSE'
              : evaluationMetric === 'MAE'
                ? 'MAE'
                : evaluationMetric === 'MBE'
                  ? 'MBE'
                  : ''
        }
        units={getUnits(band)}
      />
    </Box>

  )
}

export default DataDisplay

/*
const DataDisplay = () => {
    
    //Get shared context state
    const { 
      band,
      time,
      regionData,
      colormapName,
      clim
    } = useRegionContext()

    const colormap = useThemedColormap(colormapName)

    
    const value = regionData?.value

    //console.log('regionData:', regionData)

    if (!value || !value.climate) {
      
      return 'loading...'
      
     
    }
    //console.log('regionData.value.climate[band][time]:', regionData.value.climate[band][time])

    const data = value.climate[band][time]
    const area = value.climate[band][time]

    console.log('data in display:', data)

    if (!data || data.length === 0) {
      console.error('Data is invalid or empty:', data)
      return 'No data available'
    } 
  
    /*
    let averageResult
    const filteredData = value.climate[band][time].filter((d) => d !== 9.969209968386869e36)
    if (filteredData.length === 0) {
      averageResult = 'no data in region'
    } else {

      
      const average =
        filteredData.reduce((a, b) => a + b, 0) / filteredData.length
      if (band === 'u10') {
        averageResult = `Average: ${average.toFixed(2)}`
      } else {
        averageResult = `Average: ${average.toFixed(2)}ºC`
      }
    }
    */



/*
  return (
      <Box
        sx={{
          ml: [2],
          mt: ['-1px'],
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
        }}
      > 
        {averageResult}


      </Box> 
    )
    
  
}


export default DataDisplay
*/

/*
const DataDisplay = ({ data }) => {
    if (!data) {
      return <Box>No data available</Box>
    }
  
    // Render the data
    return <Box></Box>
  }

*/

/*
          <BinnedSummary
            clim={clim}
            colormap={colormap}
            data={values}
            area={area}
            label={
              typeof LABEL_MAP[layer] === 'string'
                ? LABEL_MAP[layer]
                : LABEL_MAP[layer][target]
            }
            units={LAYER_UNITS[layer][target]}


        />
*/