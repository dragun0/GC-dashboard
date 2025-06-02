import { Box, useThemeUI, Spinner } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Column, Filter } from '@carbonplan/components'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Minimap, Raster, Path, Sphere, Graticule } from '@carbonplan/minimaps'
import { naturalEarth1, mercator, orthographic, equirectangular } from '@carbonplan/minimaps/projections'
import { useThemedColormap, viridis } from '@carbonplan/colormaps'
import MonthSlider from '../components_plotsPage/month-slider'
import LeadTimesSlider from '../components_plotsPage/lead-times-slider'
import zarr from 'zarr-js'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import pool from 'ndarray-scratch'
import Legend from '../components_plotsPage/lead-times-legend'
import { get } from 'ol/proj'
import { set } from 'ol/transform'
import { color } from '@carbon/charts'

// plate carree projection zarr works: 
// has float32 data and is in equirectangular projection BUT y axis NEEDS TO BE FLIPPED (is going from + to - instead of - to +)


//const ZARR_SOURCE = 'https://dashboard-minimaps.s3.amazonaws.com/minimap_test_zlib_flipped_float32.zarr'
const ZARR_SOURCE_gc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_RMSE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsfc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_RMSE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsai_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_RMSE_MAP_leadtimes.zarr'

const ZARR_SOURCE_gc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_MBE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsfc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_MBE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsai_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_MBE_MAP_leadtimes.zarr'

const ZARR_SOURCE_gc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_MAE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsfc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_MAE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsai_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_MAE_MAP_leadtimes.zarr'

const AFRICA_ZARR_SOURCE_marsai_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsai_MAE_MAP_leadtimes.zarr'

//const VARIABLE = 't2m'
const FILL_VALUE = 9.969209968386869e36




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
        fontWeight: 'bold',
        letterSpacing: 'smallcaps',
        // textTransform: 'uppercase',
        fontSize: [3, 3, 3, 4],
        mb: [2],
    },
    subheading: {
        fontFamily: 'mono',
        letterSpacing: 'mono',
        color: 'secondary',
        fontSize: [1],
        textTransform: 'uppercase',
    },

    legend: {
        color: 'primary ',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        fontSize: [1, 1, 1, 2],
        textTransform: 'uppercase',
        mt: ['3px', '3px', '3px', '1px'],
    },
}

const CLIM_RANGES = {
    RMSE: {
        t2m: { min: 0, max: 10 },
        q: { min: 0, max: 3 },
        msl: { min: 0, max: 14 },
        u10: { min: 0, max: 8 },
        v10: { min: 0, max: 8 },
    },
    MAE: {
        t2m: { min: 0, max: 10 },
        q: { min: 0, max: 3 },
        msl: { min: 0, max: 14 },
        u10: { min: 0, max: 8 },
        v10: { min: 0, max: 8 },
    },
    MBE: {
        t2m: { min: -2, max: 2 },
        q: { min: -1, max: 1 },
        msl: { min: -2, max: 2 },
        u10: { min: -2, max: 2 },
        v10: { min: -2, max: 2 },
    },
}

const COLORMAPS = {
    RMSE: {
        t2m: { name: 'warm', reverse: false },
        q: { name: 'cool', reverse: false },
        msl: { name: 'earth', reverse: false },
        u10: { name: 'water', reverse: false },
        v10: { name: 'water', reverse: false },
    },
    MAE: {
        t2m: { name: 'warm', reverse: false },
        q: { name: 'cool', reverse: false },
        msl: { name: 'earth', reverse: false },
        u10: { name: 'water', reverse: false },
        v10: { name: 'water', reverse: false },
    },
    MBE: {
        t2m: { name: 'redteal', reverse: true },      // reversed!
        q: { name: 'orangeblue', reverse: true },
        msl: { name: 'pinkgreen', reverse: true },
        u10: { name: 'bluegrey', reverse: true },
        v10: { name: 'bluegrey', reverse: true },
    },
}


const LeadTimesMap = (props) => {

    const {
        LAT_MIN,
        LAT_MAX,
        region
    } = props

    // const africaGeoJSON = await fetch('/geo/africa.geojson').then(res => res.json());

    const { theme } = useThemeUI()
    // const colormap = useThemedColormap('warm')
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState(4)
    const [chunks, setChunks] = useState(null)
    const [clim, setClim] = useState([0, 10]) // default clim for the colormap
    const [colormapName, setColormapName] = useState('warm') // default colormap
    const [colormapReverse, setColormapReverse] = useState(false)

    const colormap = useThemedColormap(colormapName)
    const finalColormap = colormapReverse ? [...colormap].reverse() : colormap


    // for buttons UI only
    const [models, setModel] = useState({ GraphCast: true, ECMWFIFS: false, ECMWFAIFS: false })
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    const [selectedVariable, setSelectedVariable] = useState('t2m');
    const [selectedModel, setSelectedModel] = useState('ECMWFAIFS')
    const [selectedMetric, setSelectedMetric] = useState('MAE')

    const variableCache = useRef({}) // cache for loaded variables

    // handle variable change
    const handleVariableChange = useCallback((e) => {
        console.log('handleVariableChange', e.target.value)
        const selected = e.target.value
        setSelectedVariable(selected)
        //  setClim([CLIM_RANGES[selected].min, CLIM_RANGES[selected].max])
    }, [setSelectedVariable])
    // change clim values depending on variable

    const cacheKey = `${selectedModel}_${selectedMetric}_${selectedVariable}`

    // choose ZARR_SOURCE based on model
    let ZARR_SOURCE = ''
    if (region == 'africa') {
        if (selectedModel === 'GraphCast' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_gc_RMSE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsfc_RMSE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsai_RMSE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_gc_MBE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MBE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsai_MBE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_gc_MAE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MAE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MAE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsai_MAE

    } else {
        if (selectedModel === 'GraphCast' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_gc_RMSE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsfc_RMSE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsai_RMSE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_gc_MBE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MBE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsai_MBE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_gc_MAE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MAE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_marsai_MAE

    }

    // Define the latitude range for the tropics/subtropics
    // const LAT_MIN = -35
    // const LAT_MAX = 35

    // State to hold the latitude values
    const [latitudes, setLatitudes] = useState(null)

    // Generate latitude array manually in JS on first render
    // could not access /y from Zarr, so generating it since compressor used for coordinates was blosc instead of zlib (blosc is not supported by zarr-js)
    useEffect(() => {
        if (!latitudes) {
            const nLat = 721 // 
            const Latitudes = Array.from({ length: nLat }, (_, i) => -90 + i * (180 / (nLat - 1)))
            setLatitudes(Latitudes)
        }
        //  console.log('Latitudes generated:', latitudes)
    })



    // Load latitude values from Zarr on first load
    /*
    useEffect(() => {
        // Only load once
        if (!latitudes && ZARR_SOURCE) {
            zarr().load(`${ZARR_SOURCE}/y`, (err, arr) => {
                if (err) {
                    console.error('Error loading latitude array:', err)
                    return
                }
                // Convert to plain JS array
                setLatitudes(Array.from(arr.data))
            })
        }
    }, [ZARR_SOURCE, latitudes])

    */


    useEffect(() => {

        console.log('useEffect - Selected variable changed:', selectedVariable)
        console.log('cacheKey:', cacheKey)

        // Load the selected variable only if not cached
        if (!variableCache.current[cacheKey]) {
            setLoading(true) // <--- Set loading to true 
            console.log('useEffect - load new data:', selectedVariable)
            console.log('URL:', `${ZARR_SOURCE}/${selectedVariable}`)
            zarr().load(`${ZARR_SOURCE}/${selectedVariable}`, (err, arr) => {
                if (err) {
                    setLoading(false)
                    console.error('Error loading array:', err)
                    // add error message to the map as well
                    return
                }
                variableCache.current[cacheKey] = arr
                setChunks(arr)
                setLoading(false)
                const climRange = CLIM_RANGES[selectedMetric]?.[selectedVariable] || { min: 0, max: 1 }
                setClim([climRange.min, climRange.max]) // set clim based on variable and metric
                const colormapConfig = COLORMAPS[selectedMetric]?.[selectedVariable] || { name: 'warm', reverse: false }
                setColormapName(colormapConfig.name)
                setColormapReverse(colormapConfig.reverse)
                console.log('useEffect chunk updated with variable:', selectedVariable, 'with data:', arr)
            })
        } else {
            console.log('useEffect - var:', selectedVariable, 'already cached, using cached data')
            setChunks(variableCache.current[cacheKey])
            setLoading(false)
            const climRange = CLIM_RANGES[selectedMetric]?.[selectedVariable] || { min: 0, max: 1 }
            setClim([climRange.min, climRange.max])
            const colormapConfig = COLORMAPS[selectedMetric]?.[selectedVariable] || { name: 'warm', reverse: false }
            setColormapName(colormapConfig.name)
            setColormapReverse(colormapConfig.reverse)
        }
    }, [selectedModel, selectedMetric, selectedVariable])


    const data = useMemo(() => {
        if (chunks && latitudes) {

            // Temperate zones: 35 to 60 and -60 to -35
            if (LAT_MIN === -60 && LAT_MAX === 60) {
                // Find indices for the -60 to 60 latitude window
                const latStartAll = latitudes.findIndex(lat => lat >= -60)
                let latEndAll = latitudes.findIndex(lat => lat > 60)
                if (latEndAll === -1) latEndAll = latitudes.length
                const nLatSubset = latEndAll - latStartAll
                const nLon = chunks.shape[2]

                // Indices for north and south temperate bands within the subset
                const northStart = latitudes.findIndex(lat => lat >= 35)
                let northEnd = latitudes.findIndex(lat => lat > 60)
                if (northEnd === -1) northEnd = latitudes.length

                const southStart = latitudes.findIndex(lat => lat >= -60)
                let southEnd = latitudes.findIndex(lat => lat > -35)
                if (southEnd === -1) southEnd = latitudes.length

                // Adjust indices to be relative to the subset
                const northStartSub = northStart - latStartAll
                const northEndSub = northEnd - latStartAll
                const southStartSub = southStart - latStartAll
                const southEndSub = southEnd - latStartAll

                const picked = chunks.pick(time, null, null)

                // Bands (relative to full picked)
                const northBand = picked.lo(northStart, 0).hi(northEnd - northStart, nLon)
                const southBand = picked.lo(southStart, 0).hi(southEnd - southStart, nLon)

                // Create a subset array filled with FILL_VALUE
                const subset = ndarray(
                    new picked.data.constructor(nLatSubset * nLon),
                    [nLatSubset, nLon]
                )
                ops.assigns(subset, FILL_VALUE)

                // Copy northBand into subset
                for (let i = 0; i < northBand.shape[0]; ++i)
                    for (let j = 0; j < nLon; ++j)
                        subset.set(i + northStartSub, j, northBand.get(i, j))
                // Copy southBand into subset
                for (let i = 0; i < southBand.shape[0]; ++i)
                    for (let j = 0; j < nLon; ++j)
                        subset.set(i + southStartSub, j, southBand.get(i, j))

                return subset
            } else {
                // Default: single band
                const latStart = latitudes.findIndex(lat => lat >= LAT_MIN)
                let latEnd = latitudes.findIndex(lat => lat > LAT_MAX)
                if (latEnd === -1) latEnd = latitudes.length
                const picked = chunks.pick(time, null, null)
                const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1])
                return cropped
            }
        } else {
            return null
        }
    }, [chunks, time, latitudes, LAT_MIN, LAT_MAX])


    /*

    const data = useMemo(() => {
        if (chunks && latitudes) {
            // Find indices for cropping
            const latStart = latitudes.findIndex(lat => lat >= LAT_MIN)
            // Find the first index greater than LAT_MAX, or use the end of the array
            let latEnd = latitudes.findIndex(lat => lat > LAT_MAX)
            if (latEnd === -1) latEnd = latitudes.length
            // Pick the time slice, then crop latitude
            const picked = chunks.pick(time, null, null)
            const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1])
            //    console.log('Cropped data shape:', cropped.shape)
            return cropped

        } else {
            return {}
        }
    }, [chunks, time])

    */


    /*
      const data = useMemo(() => {
          if (chunks) {
              return chunks.pick(time, null, null) // time, lat, lon
          } else {
              return null
          }
      }, [chunks, time])
  
  */


    // for debugging only
    useEffect(() => {
        console.log('Updated data:', data)


    }, [data])


    // for debugging only
    useEffect(() => {
        console.log('selected var changed:', selectedVariable)
    }, [selectedVariable])





    return (
        <>
            {/* Title Section - Lead Times Spatial Performance */}
            <Box sx={{
                pt: [3, 4, 5, 6],
                pb: [1, 2, 3, 4],

            }}>
                <TooltipWrapper
                    tooltip=' Visualises the performance of the selected forecast model in different parts of the 
                    regional extent at each lead time computed over all months of the year 2024.
                    Each pixel in this map answers the question: "On average across the year, how wrong is the model at this location for this lead time?"'
                >
                    <Box
                        sx={{
                            ...sx.heading,
                            //   fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'blue',

                        }}>
                        Lead Times Spatial Performance


                    </Box>
                </TooltipWrapper>
            </Box>


            {/* Lead Time slider and Legend side by side */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // push children to opposite sides
                    width: '100%',
                    mt: 2,
                    mb: 2,
                    gap: 4,
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0, mr: 4 }}>
                    <LeadTimesSlider
                        time={time}
                        setTime={setTime}
                        max={40}
                        delay={250}
                        pause='max'
                    />
                </Box>
                <Box sx={{ minWidth: 180, mr: 1 }}>
                    <Legend
                        selectedVariable={selectedVariable}
                        clim={clim}
                        setClim={setClim}
                        colormap={finalColormap}
                    />
                </Box>
            </Box>


            <Row>
                {/* Left column: Mini Map filters */}
                <Column start={[1, 1]} width={[2]}>
                    <Box
                        sx={{
                            pt: 3,
                            pb: 3,

                        }}
                    >
                        {/* Filters */}
                        <Box
                            sx={{
                                pb: 3,
                            }}
                        >
                            <Filter
                                values={models}
                                // labels={{ q: 'Specific humidity' }}
                                setValues={(newModels) => {
                                    setModel(newModels)
                                    const selected = Object.keys(newModels).find(key => newModels[key])
                                    if (selected) setSelectedModel(selected)
                                }}
                                multiSelect={false}
                            />
                        </Box>


                        <Box
                            sx={{
                                pb: 3,
                            }}
                        >
                            <Filter
                                values={variables}
                                setValues={(newVariable) => {
                                    // highlight the selected variable
                                    setVariables(newVariable)
                                    //Call handleVariableChange when the filter changes
                                    const selectedVariable = Object.keys(newVariable).find(key => newVariable[key]);
                                    if (selectedVariable) {
                                        handleVariableChange({ target: { value: selectedVariable } })
                                    }
                                }}
                                multiSelect={false}
                            />
                        </Box>
                        <Filter
                            values={metrics}
                            setValues={(newMetrics) => {
                                setMetrics(newMetrics)
                                const selected = Object.keys(newMetrics).find(key => newMetrics[key])
                                if (selected) setSelectedMetric(selected)
                            }}
                            multiSelect={false}
                        />

                    </Box>



                </Column>

                {/* Right column: Minimap */}
                <Column start={[3]} width={[10]}>
                    <Box
                        sx={{
                            position: 'relative',

                            //  color: 'primary',

                            pb: 30
                        }}
                    >
                        {/* Spinner overlay */}
                        {loading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000,
                                    backgroundColor: 'transparent',
                                    borderRadius: 0,
                                    p: 0,
                                }}
                            >
                                <Spinner size={32} />
                            </Box>
                        )}

                        <Minimap projection={naturalEarth1}
                            {...(region !== 'africa' ? {
                                scale:
                                    1

                            } : { scale: 2 })}

                            translate={[0, 0]} >

                            <Path
                                stroke={theme.colors.primary}
                                source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
                                feature={'land'}
                            />

                            <Graticule stroke={theme.colors.primary} />
                            <Sphere fill={theme.colors.background} />


                            <Raster

                                // clim={[vmin, vmax]}
                                //   bounds={[-35, 35, -180, 180]}

                                clim={clim}
                                mode={'lut'}
                                nullValue={FILL_VALUE}
                                source={data}
                                colormap={finalColormap}
                                {...(region !== 'africa' ? {
                                    bounds: {
                                        lat: [LAT_MIN, LAT_MAX],
                                        lon: [-180, 180]
                                    }
                                } : {})}

                            />


                        </Minimap>
                    </Box>
                </Column>
            </Row>
        </>




    )
}

export default LeadTimesMap


/*

const getCustomProjection = () => {
    return {
        ...naturalEarth1(),
        glsl: {
            func: `
      vec2 naturalEarth1Invert(float x, float y)
      {
        const float pi = 3.14159265358979323846264;
        const float halfPi = pi * 0.5;
        float phi = y;
        float delta;
        float phi2 = phi * phi;
        float phi4 = phi2 * phi2;
        for (int i = 0; i < 25; i++) {
          phi2 = phi * phi;
          phi4 = phi2 * phi2;
          delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.015085 * 3.0 + phi4 * (-0.044475 * 7.0 + 0.028874 * 9.0 * phi2 - 0.005916 * 11.0 * phi4)));
          phi = phi - delta;
          if (abs(delta) < 1e-6) {
            break;
          }
        }
        phi2 = phi * phi;
        float lambda = x / (0.8707 + phi2 * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2))));
        if (lambda <= -1.0 * pi + 1e-6 || lambda >= pi - 1e-6) {
          return vec2(-1000.0, -1000.0);
        } else {
          return vec2(degrees(lambda), degrees(phi));
        }
      }
    `,
            name: 'naturalEarth1Invert',
        },
    }
}
    */



/*
if (props.region === 'africa') {
                // Find latitude indices for Africa
                const latStart = latitudes.findIndex(lat => lat >= -35)
                let latEnd = latitudes.findIndex(lat => lat > 35)
                if (latEnd === -1) latEnd = latitudes.length

                // Generate longitude array (assuming regular grid)
                const nLon = chunks.shape[2]
                const nLat = chunks.shape[1]
                const longitudes = Array.from({ length: nLon }, (_, i) => -180 + i * (360 / nLon))

                // Find longitude indices for Africa
                const lonStart = longitudes.findIndex(lon => lon >= -20)
                let lonEnd = longitudes.findIndex(lon => lon > 55)
                if (lonEnd === -1) lonEnd = nLon

                // Pick the time slice
                const picked = chunks.pick(time, null, null)

                // Create a full array filled with FILL_VALUE
                const full = ndarray(
                    new picked.data.constructor(nLat * nLon),
                    [nLat, nLon]
                )
                ops.assigns(full, FILL_VALUE)

                // Copy Africa region data into the mask
                for (let i = latStart; i < latEnd; ++i) {
                    for (let j = lonStart; j < lonEnd; ++j) {
                        full.set(i, j, picked.get(i, j))
                    }
                }

                return full
            }

            */