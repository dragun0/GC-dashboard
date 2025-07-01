import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Circle,
  Plot,
  TickLabels,
} from '@carbonplan/charts'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'
import { Box } from 'theme-ui'
import { useMemo } from 'react'
import { SidebarFooter } from '@carbonplan/layouts'
import { useRegionContext } from '../components/region'
import ExpandingSection from './expanding-section'
import { useRegion } from '@carbonplan/maps'
import React from 'react'

const TimeSeries = () => {
  const {
    band,
    showTimeSeries,
    setShowTimeSeries,
    showRegionPicker,
    regionData,
    time,
    forecastModel,
    evaluationMetric,
    year,
    month,
  } =
    useRegionContext()

  const getBandName = (band, evaluationMetric) => {
    let metricLabel
    if (evaluationMetric === 'AE') metricLabel = 'MAE'
    else if (evaluationMetric === 'RMSE') metricLabel = 'RMSE'
    else if (evaluationMetric === 'MAE') metricLabel = 'MAE'
    else if (evaluationMetric === 'MBE') metricLabel = 'MBE'
    else metricLabel = evaluationMetric

    if (band === 'u10') {
      return `${metricLabel} (m/s)`
    } else if (band === 't2m') {
      return `${metricLabel} (ºC)`
    } else if (band === 'q') {
      return `${metricLabel} (g/kg)`
    } else {
      return `${metricLabel} (${band})`
    }
  }

  { evaluationMetric === 'AE' && 'MAE:' }
  { evaluationMetric === 'RMSE' && 'Average RMSE:' }
  { evaluationMetric === 'MAE' && 'Average MAE:' }
  { evaluationMetric === 'MBE' && 'Average MBE:' }

  // needed to access the regionPickers center coordinates and radius for CSV file download
  const { region } = useRegion()
  //console.log('region:', region)
  const data = regionData?.value?.climate?.[band] // access the band data from regionData


  // this loading statement is not working
  const { lineData, range, domain } = useMemo(() => {
    if (!data || !band) {
      return { lineData: undefined, range: undefined, domain: undefined }
    }
    //console.log('region.properties.radius:', region.properties.radius)

    // for debugging
    // console.log('regionData:', regionData)
    // console.log('regionData.value:', regionData.value)
    // console.log('regionData.value[climate]:', regionData.value['climate'])
    // console.log('regionData.value[climate].band:', regionData.value['climate'][band])

    let domain = [Infinity, -Infinity] // initialise x-axis range
    let range = [Infinity, -Infinity] // Initialize y-axis range


    const lineData = Object.keys(data).map((key) => {
      const values = data[key]
      const filtered = values.filter((d) => d !== 9.969209968386869e36)
      const sum = filtered.reduce((a, d) => a + d, 0)
      const value = sum / filtered.length
      range = [Math.min(range[0], value), Math.max(range[1], value)]  // y-axis
      domain = [Math.min(domain[0], key), Math.max(domain[1], key)]   // x-axis
      return [Number(key), value]
    })

    return { lineData, range, domain }
  }, [data])
  // console.log('lineData:', lineData)


  const timeData = lineData && lineData.find((d) => d[0] === Number(time))
  const validtimeData = timeData && !Number.isNaN(timeData[1])

  //console.log('validtimeData:', validtimeData)

  // Download CSV
  const handleDownloadCSV = () => {
    // check regionpicker radius is NOT zero
    // regionData.value.radius == null
    if (!data || !regionData?.value || !band || region.properties.radius == null) {
      alert('No data available for export.')
      return
    }


    //const [centerLon, centerLat] = region.properties.center
    const radius = region.properties.radius
    const centerLon = region.properties.center.lng
    const centerLat = region.properties.center.lat
    //console.log('region.properties.center.lat:', region.properties.center.lat )

    let startDate
    if (forecastModel === 'marsfc') {
      startDate = new Date(`${year}-${month}-01T00:00:00Z`) // UTC base datetime
    } else {
      startDate = new Date(`${year}-${month}-01T06:00:00Z`)
    }

    const getValueKey = (evaluationMetric) => {
      if (evaluationMetric === 'AE' || evaluationMetric === 'MAE') return 'MAE'
      if (evaluationMetric === 'RMSE') return 'RMSE'
      if (evaluationMetric === 'MBE') return 'MBE'
      return 'Value'
    }

    const getUnits = (band) => {
      if (band === 't2m') return '°C'
      if (band === 'q') return 'g/kg'
      return ''
    }

    const valueKey = getValueKey(evaluationMetric)
    const valueUnit = getUnits(band)
    const leadtimeUnit = 'hours'

    // ...inside handleDownloadCSV...

    const rows = lineData.map(([timestep, value]) => {
      let row = {
        lat: centerLat,
        lon: centerLon,
        radius: radius.toFixed(2),
        timestep,
        [valueKey]: value.toFixed(4),
      }

      if (evaluationMetric === 'AE') {
        const datetime = new Date(startDate.getTime() + timestep * 6 * 60 * 60 * 1000).toISOString()
        row.datetime = datetime
      } else {
        row.leadtime = timestep * 6
      }

      return row
    })

    const header = evaluationMetric === 'AE'
      ? [
        'timestep',
        'datetime',
        valueKey + (valueUnit ? ` [${valueUnit}]` : ''),
        'lat',
        'lon',
        'radius'
      ]
      : [
        'timestep',
        `leadtime [${leadtimeUnit}]`,
        valueKey + (valueUnit ? ` [${valueUnit}]` : ''),
        'lat',
        'lon',
        'radius'
      ]

    const csv = [
      header.join(','),
      ...rows.map((row) =>
        header.map((h) => {
          // Remove units from header to get the key
          if (h.startsWith(valueKey)) return row[valueKey]
          if (h.startsWith('leadtime')) return row.leadtime
          if (h === 'datetime') return row.datetime
          return row[h]
        }).join(',')
      ),
    ].join('\n')





    let forecastModelName
    if (forecastModel === 'marsfc') {
      forecastModelName = 'ECMWF_IFS';
    } else if (forecastModel === 'marsai') {
      forecastModelName = 'ECMWF_AIFS';
    } else if (forecastModel === 'gc') {
      forecastModelName = 'GC';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `region_${evaluationMetric}_timeseries_${year}${month}_${forecastModelName}_${band}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  }



  return (
    <SidebarFooter
      sx={{
        pt: [3],
        pb: [3],

      }}
    >
      <ExpandingSection
        label='Time series'
        onClick={() => setShowTimeSeries(!showTimeSeries)}


      >
        <Box
          sx={{
            width: '100%',
            height: ['200px', '200px', '125px', '200px'],
            display: 'flex', // Use flexbox for alignment
            flexDirection: 'column', // Stack children vertically
            justifyContent: 'center', // Center the chart vertically
            alignItems: 'center', // Center the chart horizontally (optional)
            //paddingTop: '-20px', // Add padding to move the chart lower
            transform: 'translateY(10px)'
          }}
        >
          {regionData?.value && domain && timeData && (

            <Chart
              x={domain} y={range}  >

              <Grid horizontal />
              <Grid vertical />
              <TickLabels bottom
                format={(v) => (v * 0.25)} // Convert timestep to days and round
              />
              <TickLabels left
              />
              <AxisLabel left>{getBandName(band, evaluationMetric)}</AxisLabel>
              <AxisLabel bottom>Lead Time (days)</AxisLabel>


              <Box
                sx={{
                  position: 'absolute',
                  right: 5,
                  top: '-45px',
                  mt: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: [2, 2, 2, 8], // Space between button and MAE label
                }}
              >
                <Box
                  sx={{
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    textTransform: 'uppercase',
                    fontSize: [0, 0, 0, 1],
                    color: 'secondary',
                  }}
                >
                  <Box as='span' sx={{ textTransform: 'none', mr: 1 }}>
                    {evaluationMetric === 'AE' && 'MAE:'}
                    {evaluationMetric === 'RMSE' && 'Average RMSE:'}
                    {evaluationMetric === 'MAE' && 'Average MAE:'}
                    {evaluationMetric === 'MBE' && 'Average MBE:'}
                  </Box>
                  <Box as='span' >
                    {timeData[1].toFixed(2)}
                  </Box>
                  <Box as='span' sx={{ textTransform: 'none' }}>
                    {band === 'q' ? ' g/kg' : ' °C'}
                  </Box>
                </Box>
                <Button
                  inverted
                  onClick={handleDownloadCSV}
                  size='xs'
                  sx={{
                    fontSize: [1, 1, 1, 2],
                    textTransform: 'uppercase',
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    minWidth: '120px',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    '&:disabled': {
                      color: 'muted',
                      pointerEvents: 'none',
                    },
                  }}
                  prefix={<Down />}
                >
                  Download CSV
                </Button>


              </Box>

              <Plot>
                {validtimeData && (
                  <Circle
                    x={timeData[0]} // Convert time step to days
                    y={timeData[1]}
                    color={'primary'}
                    size={9}
                  />
                )}
                <Line data={lineData} />
              </Plot>
            </Chart>

          )}
        </Box>
      </ExpandingSection>
    </SidebarFooter>
  )
}

export default TimeSeries


/*
// Download CSV
  const handleDownloadCSV = () => {
    // check regionpicker radius is NOT zero
    // regionData.value.radius == null
    if (!data || !regionData?.value || !band) {
      alert('No data available for export.')
      return
    }

    const [centerLon, centerLat] = regionData.value.center
    const radius = regionData.value.radius

    const rows = data.map(([timestep, mae]) => ({
      lat: centerLat,
      lon: centerLon,
      radius,
      timestep,
      mae: mae === 9.969209968386869e36 ? '' : mae.toFixed(4),
    }))

    const header = ['lat', 'lon', 'radius', 'timestep', 'mae']
    const csv = [
      header.join(','),
      ...rows.map((row) => header.map((h) => row[h]).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `region_mae_timeseries_${band}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
*/