import { Box } from 'theme-ui'
import { useCallback, useMemo } from 'react'
import { Row, Column, Filter, Select } from '@carbonplan/components'
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
}


const CLIM_RANGES = {
  AE: {
    t2m: { min: 0, max: 10 },
    q: { min: 0, max: 3 },
  },
  RMSE: {
    t2m: { min: 0, max: 10 },
    q: { min: 0, max: 3 },
  },
  MAE: {
    t2m: { min: 0, max: 10 },
    q: { min: 0, max: 3 },
  },
  MBE: {
    t2m: { min: -2, max: 2 },
    q: { min: -1, max: 1 },
  },
}


const DEFAULT_COLORMAPS = {
  AE: {
    t2m: { name: 'warm', reverse: false },
    q: { name: 'cool', reverse: false },
  },
  RMSE: {
    t2m: { name: 'warm', reverse: false },
    q: { name: 'cool', reverse: false },
  },
  MAE: {
    t2m: { name: 'warm', reverse: false },
    q: { name: 'cool', reverse: false },
  },
  MBE: {
    t2m: { name: 'redteal', reverse: true },      // reversed!
    q: { name: 'orangeblue', reverse: true },
  },
}



const DatasetControls = () => {
  const {
    setClim,
    band,
    setBand,
    setColormapName,
    forecastModel,
    setForecastModel,
    evaluationMetric,
    setEvaluationMetric,
    setMonth,
    setColormapReverse,
  } = useRegionContext()

  // handle change of variable 
  const handleBandChange = useCallback((e) => {
    const band = e.target.value
    setBand(band)
    const climRange = CLIM_RANGES[evaluationMetric]?.[band] || { min: 0, max: 1 }
    setClim([climRange.min, climRange.max])
    const colormapConfig = DEFAULT_COLORMAPS[evaluationMetric]?.[band] || { name: 'warm', reverse: false }
    setColormapName(colormapConfig.name)
    setColormapReverse(colormapConfig.reverse)
  }, [setBand, evaluationMetric])

  // handle change of forecast Model
  const handleModelChange = useCallback((e) => {
    const forecastModel = e.target.value
    setForecastModel(forecastModel)
  }, [setForecastModel])

  // handle change of evaluation metric
  const handleEvalMetricChange = useCallback((e) => {
    const evaluationMetric = e.target.value
    setEvaluationMetric(evaluationMetric)
    const climRange = CLIM_RANGES[evaluationMetric]?.[band] || { min: 0, max: 1 }
    setClim([climRange.min, climRange.max])
    const colormapConfig = DEFAULT_COLORMAPS[evaluationMetric]?.[band] || { name: 'warm', reverse: false }
    setColormapName(colormapConfig.name)
    setColormapReverse(colormapConfig.reverse)
  }, [setEvaluationMetric, band])

  const getMonthCode = (monthName) => {
    const monthIndex = month_options.indexOf(monthName) + 1
    const paddedMonth = monthIndex.toString().padStart(2, '0')
    return paddedMonth
  }


  const handleMonthChange = useCallback((e) => {
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
  const [metrics, setMetrics] = useState({ AE: true, MAE: false, RMSE: false, MBE: false }) // BE: false, RE: false, RA: false 


  // used to make ECMWF AIFS unavailable for January and February
  const [selectedMonth, setSelectedMonth] = useState('June')

  // used to conditionally show ECMWF AIFS option only when month is not January or February OR evaluation metric is not AE
  const showAIFS = useMemo(() => {
    return evaluationMetric !== 'AE' ||
      !['January', 'February'].includes(selectedMonth)
  }, [evaluationMetric, selectedMonth])

  // conditional model labels based on showAIFS
  const modelLabels = useMemo(() => ({
    marsfc: 'ECMWF-IFS',
    gc: 'GraphCast',
    ...(showAIFS && { marsai: 'ECMWF-AIFS' }),
  }), [showAIFS])


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
              key={Object.keys(modelLabels).join(',')} // ensure filter rerenders when modelLabels change
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
              labels={{ AE: 'Absolute Error', MAE: 'Mean Absolute Error', RMSE: 'Root Mean Squared Error', MBE: 'Mean Bias Error' }}

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
            tooltip='Select a time frame for the forecast assessment. The absolute error is available per month. All other metrics are computed over the whole year. All models have a lead time of 10 days, forecasted in 6 hour increments. 
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

            {evaluationMetric === 'AE' && (
              <Select
                size='xs'
                value={selectedMonth} // ensures UI matches the state after change from e.g. RMSE (where filter is not rendered) to AE (filter is rerendered)
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
            )}

          </TooltipWrapper>

        </Column>
      </Row>




    </>
  )

}

export default DatasetControls
