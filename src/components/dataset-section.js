import { Box, Flex } from 'theme-ui'
import { useCallback } from 'react'
import { Row, Column, Filter, Slider, Badge, Toggle, Select, Link } from '@carbonplan/components'
import { colormaps } from '@carbonplan/colormaps'
import { useRegionContext } from './region'
import { useState } from 'react'
import TooltipWrapper from './tooltip-wrapper'


const sx = {
  label: {
    color: 'secondary',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    fontSize: [1, 1, 1, 2],
    textTransform: 'uppercase',
    mt: ['3px', '3px', '3px', '1px'],
  },
  heading: {
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
    mb: [3],
  },
  /*
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    fontSize: [1, 1, 1, 2],
    mt: [3],
  },
  */
}

const CLIM_RANGES = {
  t2m: { max: 15, min: 0 },
  q: { max: 5, min: 0 },
}

const DEFAULT_COLORMAPS = {
  t2m: 'warm',
  q: 'cool',
}

const DatasetControls = () => {
  const {
    opacity,
    setOpacity,
    clim,
    setClim,
    band,
    setBand,
    colormapName,
    setColormapName,
    forecastModel,
    setForecastModel,
    evaluationMetric,
    setEvaluationMetric,
    setMonth
  } = useRegionContext()

  // handle change of variable 
  const handleBandChange = useCallback((e) => {
    console.log('handleBandChange', e.target.value)
    const band = e.target.value
    setBand(band)
    setClim([CLIM_RANGES[band].min, CLIM_RANGES[band].max])
    setColormapName(DEFAULT_COLORMAPS[band])
  }, [setBand, setClim, setColormapName])

  // handle change of forecast Model
  const handleModelChange = useCallback((e) => {
    console.log('handleModelChange', e.target.value)
    const forecastModel = e.target.value
    setForecastModel(forecastModel)
  }, [setForecastModel])

  // handle change of evaluation metric
  const handleEvalMetricChange = useCallback((e) => {
    console.log('handleEvalMetricChange', e.target.value)
    const evaluationMetric = e.target.value
    setEvaluationMetric(evaluationMetric)
  }, [setEvaluationMetric])

  const getMonthCode = (monthName) => {
    const monthIndex = month_options.indexOf(monthName) + 1
    const paddedMonth = monthIndex.toString().padStart(2, '0')
    return paddedMonth
  }


  const handleMonthChange = useCallback((e) => {
    console.log('handleMonthChange', e.target.value)
    const month = e.target.value
    setSelectedMonth(month)
    const monthCode = getMonthCode(month)
    setMonth(monthCode)
  }, [setMonth])



  const month_options = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // only necessary for highlighting the radio buttons
  const [models, setModels] = useState({ marsfc: false, gc: true, marsai: false })
  const [variables, setVariables] = useState({ t2m: true, q: false })
  const [metrics, setMetrics] = useState({ AE: true }) // BE: false, RE: false, RA: false 

  // is the time series component (and regional stats) that display the average AE
  // at each time step in the regiona not the mean absolute error

  // same question for bias error and mean bias error
  // is correlation coefficient possible to compute for each gri cell
  // at each time step?


  // used to make ECMWF AIFS unavailable for January and February
  const [selectedMonth, setSelectedMonth] = useState('January')

  // used to conditionally show ECMWF AIFS option only when month is not January or February
  const showAIFS = !['January', 'February'].includes(selectedMonth)

  // conditional model labels based on showAIFS
  const modelLabels = {
    marsfc: 'ECMWF-IFS',
    gc: 'GraphCast',
    ...(showAIFS && { marsai: 'ECMWF-AIFS' }),
  }
  // conditional model values based on modelLabels
  const modelValues = Object.fromEntries(
    Object.entries(models).filter(([key]) => key in modelLabels)
  )


  return (
    <>
      <Box sx={sx.heading}>Datasets</Box>
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={{ ...sx.label, pb: [1] }}>
          Forecast Model
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ pb: [1] }}>
          <TooltipWrapper
            tooltip='Select a forecasting model to show on the map. Chose between a physics-based deterministic model (ECMWF IFS) or a 
            machine learning deterministic model (GraphCast or ECMWF AI)'
          >

            <Filter
              values={modelValues}

              labels={modelLabels}
              setValues={(newModel) => {
                setModels(newModel)
                // Call handleModelChange when the filter changes
                const selectedModel = Object.keys(newModel).find((key) => newModel[key])
                if (selectedModel) {
                  handleModelChange({ target: { value: selectedModel } })
                }
              }}

            />
          </TooltipWrapper>
        </Column>
      </Row>

      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={{ ...sx.label, pb: [1] }}>
          Evaluation Metric
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ pb: [1] }}>
          <TooltipWrapper
            tooltip='Select an evaluation metric. All metrics are computed through the comparison of the selected model against the "truth" data: ERA5 reanalysis. '
          >
            <Filter
              values={metrics}
              labels={{ AE: 'Absolute Error', BE: 'Bias Error', RE: 'Relative Error', RA: 'Relative Accuracy' }}
              //setValues={setMetrics}

              setValues={(newMetric) => {
                setMetrics(newMetric)
                // Call handleEvalMetricChange when the filter changes
                const selectedMetric = Object.keys(newMetric).find((key) => newMetric[key])
                if (selectedMetric) {
                  handleEvalMetricChange({ target: { value: selectedMetric } })
                }
              }}

            />
          </TooltipWrapper>
        </Column>
      </Row>

      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={{ ...sx.label, pb: [1] }}>
          Variable
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ pb: [1] }}>
          <TooltipWrapper
            tooltip='Select a climate variable to show on the map. The 2-m air temperature error is shown in celsius. Error of specific humidity is shown in g/kg'
          >
            <Filter
              values={variables}
              labels={{ t2m: 'Temperature', q: 'Specific humidity' }}
              setValues={(newVariables) => {
                setVariables(newVariables)
                // Call handleBandChange when the filter changes
                const selectedBand = Object.keys(newVariables).find((key) => newVariables[key])
                if (selectedBand) {
                  handleBandChange({ target: { value: selectedBand } })
                }
              }}

            />
          </TooltipWrapper>
        </Column>
      </Row>

      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Timeframe
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ pb: [1] }}>

          <TooltipWrapper
            tooltip='Select a time frame for the forecast assessment. All models have a lead time of 10 days, forecasted in 6 hour increments. 
            The ECMWF AIFS model has only been running since March 2024, therefore no data is available for January and February.'
          >



            <Select size='xs'
              sxSelect={{
                textTransform: 'uppercase',
                fontFamily: 'mono',
                fontSize: [1, 1, 1, 2],
                width: '100%',
                pb: [1],
              }}>
              <option>2024</option>

            </Select>

            <Select
              size='xs'
              onChange={handleMonthChange}
              sxSelect={{
                textTransform: 'uppercase',
                fontFamily: 'mono',
                fontSize: [1, 1, 1, 2],
                width: '100%',
                pb: [1],
              }}>
              {month_options.map((month) => (
                <option
                  key={month}
                  value={month}
                  disabled={
                    forecastModel === 'marsai' &&
                    ['January', 'February'].includes(month)
                  }
                >
                  {month}
                </option>
              ))}
            </Select>

          </TooltipWrapper>

        </Column>
      </Row>




    </>
  )

}

export default DatasetControls

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