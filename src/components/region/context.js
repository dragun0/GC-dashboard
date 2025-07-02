import { createContext, useContext, useState } from 'react'

const RegionContext = createContext(null)

export const RegionProvider = ({ children }) => {
  const [basemap, setBasemap] = useState({ oceanMask: true, landMask: false })
  const [regionData, setRegionData] = useState(null) //(null) //({ loading: true })
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
  const showRegionPicker = showRegionControls || showTimeSeries // Derived state for RegionPicker visibility

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

  const {
    basemap,
    setBasemap,
    regionData,
    setRegionData,
    showRegionControls,
    setShowRegionControls,
    showTimeSeries,
    setShowTimeSeries,
    showRegionPicker,
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
    showRegionPicker,
    showRegionControls,
    setShowRegionControls,
    showTimeSeries,
    setShowTimeSeries,
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

