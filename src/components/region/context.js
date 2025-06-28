import { createContext, useContext, useState } from 'react'

const RegionContext = createContext(null)

export const RegionProvider = ({ children }) => {
  const [basemap, setBasemap] = useState({ oceanMask: true, landMask: false })
  const [regionData, setRegionData] = useState(null) //(null) //({ loading: true })
  //const [regionExtent, setRegionExtent] = useState(null) // for time-series component
  //const [showRegionPicker, setShowRegionPicker] = useState(false)
  const [showRegionControls, setShowRegionControls] = useState(false)
  const [showTimeSeries, setShowTimeSeries] = useState(false)
  const [band, setBand] = useState('t2m')
  const [time, setTime] = useState(1) // for time slider and raster timestep change 
  const [forecastModel, setForecastModel] = useState('gc') // for layer change
  const [evaluationMetric, setEvaluationMetric] = useState('AE') // for layer change
  const [year, setYear] = useState('2024') // for layer change
  const [month, setMonth] = useState('06')
  const [display, setDisplay] = useState(true)
  const [debug, setDebug] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [clim, setClim] = useState([0, 15])
  const [colormapName, setColormapName] = useState('warm')
  const [colormapReverse, setColormapReverse] = useState(false)
  //console.log('regionData testing:', regionData)

  // Derived state for RegionPicker visibility
  const showRegionPicker = showRegionControls || showTimeSeries

  return (
    <RegionContext.Provider

      value={{
        basemap,
        setBasemap,
        regionData,
        setRegionData,
        showRegionControls,
        setShowRegionControls,
        showTimeSeries,
        setShowTimeSeries,
        showRegionPicker,
        //setShowRegionPicker,
        band,
        setBand,
        time,
        setTime,
        forecastModel,
        setForecastModel,
        evaluationMetric,
        setEvaluationMetric,
        year,
        setYear,
        month,
        setMonth,
        display,
        setDisplay,
        debug,
        setDebug,
        opacity,
        setOpacity,
        clim,
        setClim,
        colormapName,
        setColormapName,
        colormapReverse,
        setColormapReverse,
      }}

    >
      {children}

    </RegionContext.Provider>
  )
}

export const useRegionContext = () => {
  const context = useContext(RegionContext) // for debugging
  // for debugging: Log the entire context object

  const {
    basemap,
    setBasemap,
    regionData,
    setRegionData,
    // regionExtent, // Expose regionExtent
    // setRegionExtent,
    showRegionControls,
    setShowRegionControls,
    showTimeSeries,
    setShowTimeSeries,
    showRegionPicker,
    //setShowRegionPicker, 
    band,
    setBand,
    time,
    setTime,
    forecastModel,
    setForecastModel,
    evaluationMetric,
    setEvaluationMetric,
    year,
    setYear,
    month,
    setMonth,
    display,
    setDisplay,
    debug,
    setDebug,
    opacity,
    setOpacity,
    clim,
    setClim,
    colormapName,
    setColormapName,
    colormapReverse,
    setColormapReverse,
  } = useContext(RegionContext)

  return {
    basemap,
    setBasemap,
    regionData,
    setRegionData,
    // regionExtent, // Expose regionExtent
    // setRegionExtent,
    showRegionPicker,
    showRegionControls,
    setShowRegionControls,
    showTimeSeries,
    setShowTimeSeries,
    //setShowRegionPicker,
    band,
    setBand,
    time,
    setTime,
    forecastModel,
    setForecastModel,
    evaluationMetric,
    setEvaluationMetric,
    year,
    setYear,
    month,
    setMonth,
    display,
    setDisplay,
    debug,
    setDebug,
    opacity,
    setOpacity,
    clim,
    setClim,
    colormapName,
    setColormapName,
    colormapReverse,
    setColormapReverse,

  }

}

/*
  return (
    
    <Box 
    //className="custom-scrollbar" //overflowY: 'scroll'
    sx={{ px: [2, 1], py: [0], fontSize: [1, 1, 1, 2] }} > 
      
        <Box sx={{ ...sx.label, mt: [0] }}>Variable</Box>
        <Select
          sxSelect={{ bg: 'transparent' }}
          size='xs'
          onChange={handleBandChange}
          sx={{ mt: [1] }}
          value={band}
        >
          <option value='t2m'>Temperature</option>
          <option value='u10'>Wind</option>
        </Select>

        <Box sx={{ ...sx.label, mt: [4] }}>Colormap</Box>
        <Select
          sxSelect={{ bg: 'transparent' }}
          size='xs'
          onChange={(e) => setColormapName(e.target.value)}
          sx={{ mt: [1] }}
          value={colormapName}
        >
          {colormaps.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </Select>
       
      </Box>
    
  )


}

export default DatasetControls
*/

/*
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Timescale
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
          <TooltipWrapper tooltip='Select whether to view data at a yearly or monthly timestep.'>
            <Filter
              values={timescaleFilter}
              setValues={(obj) => {
                const timescale = Object.keys(LABEL_MAP).find(
                  (k) => obj[LABEL_MAP[k]]
                )
                setFilters({ timescale })
              }}
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Scenarios
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
          <TooltipWrapper tooltip='Select whether to view historical data or future data from Shared Socioeconomic Pathways (SSPs) representing different levels of warming.'>
            <Flex sx={{ flexDirection: 'column' }}>
              <Filter
                values={historicalFilter}
                setValues={(obj) => {
                  const historical = obj[LABEL_MAP.historical]
                  const {
                    historical: previousHistorical,
                    ...previousScenarios
                  } = filters.experiment
                  const scenarios = historical
                    ? { ssp245: false, ssp370: false, ssp585: false }
                    : previousScenarios

                  setFilters({
                    experiment: {
                      historical,
                      ...scenarios,
                    },
                  })
                  clearRegionData()
                }}
                multiSelect
              />
              <Filter
                values={scenarioFilter}
                setValues={(obj) => {
                  const scenarioSelected = Object.keys(obj).some((k) => obj[k])
                  const { historical: previousHistorical } = filters.experiment
                  const historical = scenarioSelected
                    ? false
                    : previousHistorical

                  setFilters({
                    experiment: {
                      historical,
                      ssp245: obj[LABEL_MAP.ssp245],
                      ssp370: obj[LABEL_MAP.ssp370],
                      ssp585: obj[LABEL_MAP.ssp585],
                    },
                  })
                  if (historical !== previousHistorical) {
                    clearRegionData()
                  }
                }}
                multiSelect
              />
            </Flex>
          </TooltipWrapper>
        </Column>
      </Row>

      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          GCMs
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
          <TooltipWrapper tooltip='Select the global climate model (GCM) used in the creation of the dataset.'>
            <ExpandableFilter
              values={filters.gcm}
              setValues={(obj) => {
                setFilters({ gcm: obj })
              }}
              multiSelect
            />
          </TooltipWrapper>
        </Column>
      </Row>
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Methods
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
          <TooltipWrapper tooltip='Select the downscaling method used to derive the dataset.'>
            <Filter
              values={filters.method}
              setValues={(obj) => {
                setFilters({ method: obj })
              }}
              multiSelect
            />
          </TooltipWrapper>
        </Column>
      </Row>
    </>

    */







/*
  return (
    
    <Box 
    //className="custom-scrollbar" //overflowY: 'scroll'
    sx={{ px: [2, 1], py: [0], fontSize: [1, 1, 1, 2] }} > 
      
        <Box sx={{ ...sx.label, mt: [0] }}>Variable</Box>
        <Select
          sxSelect={{ bg: 'transparent' }}
          size='xs'
          onChange={handleBandChange}
          sx={{ mt: [1] }}
          value={band}
        >
          <option value='t2m'>Temperature</option>
          <option value='u10'>Wind</option>
        </Select>

        <Box sx={{ ...sx.label, mt: [4] }}>Colormap</Box>
        <Select
          sxSelect={{ bg: 'transparent' }}
          size='xs'
          onChange={(e) => setColormapName(e.target.value)}
          sx={{ mt: [1] }}
          value={colormapName}
        >
          {colormaps.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </Select>
       
      </Box>
    
  )


}

export default DatasetControls
*/