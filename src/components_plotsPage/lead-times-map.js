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

// plate carree projection zarr works: 
// has float32 data and is in equirectangular projection BUT y axis NEEDS TO BE FLIPPED (is going from + to - instead of - to +)


//const ZARR_SOURCE = 'https://dashboard-minimaps.s3.amazonaws.com/minimap_test_zlib_flipped_float32.zarr'
const ZARR_SOURCE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_RMSE_MAP_leadtimes.zarr'
//const VARIABLE = 't2m'
const FILL_VALUE = 9.969209968386869e36


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


const LeadTimesMap = () => {
    const { theme } = useThemeUI()
    const colormap = useThemedColormap('warm')
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState(4)
    const [chunks, setChunks] = useState(null)
    const [clim, setClim] = useState([0, 10]) // default clim for the colormap

    // for buttons UI only
    const [models, setModel] = useState({ GraphCast: true, ECMWFIFS: false, ECMWFAIFS: false })
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    const [selectedVariable, setSelectedVariable] = useState('t2m');

    const variableCache = useRef({}) // cache for loaded variables

    // handle variable change
    const handleVariableChange = useCallback((e) => {
        console.log('handleVariableChange', e.target.value)
        const selected = e.target.value
        setSelectedVariable(selected)
    }, [setSelectedVariable])
    // change clim values depending on variable

    useEffect(() => {

        console.log('useEffect - Selected variable changed:', selectedVariable)
        // Load the selected variable only if not cached
        if (!variableCache.current[selectedVariable]) {
            setLoading(true) // <--- Set loading to true 
            console.log('useEffect - load new var data:', selectedVariable)
            zarr().load(`${ZARR_SOURCE}/${selectedVariable}`, (err, arr) => {
                if (err) {
                    setLoading(false)
                    console.error('Error loading array:', err)
                    // add error message to the map as well
                    return
                }
                variableCache.current[selectedVariable] = arr
                setChunks(arr)
                setLoading(false)
                console.log('useEffect chunk updated with variable:', selectedVariable, 'with data:', arr)
            })
        } else {
            console.log('useEffect - var:', selectedVariable, 'already cached, using cached data')
            setChunks(variableCache.current[selectedVariable])
            setLoading(false)
        }
    }, [selectedVariable])

    const data = useMemo(() => {
        if (chunks) {
            return chunks.pick(time, null, null) // time, lat, lon
        } else {
            return {}
        }
    }, [chunks, time])


    // for debugging only
    //  useEffect(() => {
    //      console.log('Updated data:', data)


    // }, [data])


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

            {/* Lead Time slider */}
            <Box sx={{
                mt: 2,
                mb: 2,
            }}>
                <LeadTimesSlider
                    time={time}
                    setTime={setTime}
                    max={40}
                    delay={250}
                    pause='max'
                />
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
                                setValues={setModel}
                                multiSelect={false}
                            // labels={{ q: 'Specific humidity' }}
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
                            setValues={setMetrics}
                            multiSelect={false}
                        // labels={{ q: 'Specific humidity' }}
                        />

                    </Box>


                    {/* Legend 
                    // align this with bottom of the minimap
                    */}
                    <Box sx={{ mt: 6, mb: 3 }}>

                        <Legend // add unit label!
                            selectedVariable={selectedVariable}
                            //clim={[vmin, vmax]}
                            clim={clim}
                            setClim={setClim}
                            //   colormapName='warm'
                            colormap={colormap}

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
                            translate={[0, 0]} scale={1}>

                            <Path
                                stroke={'white'}
                                source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
                                feature={'land'}
                            />

                            <Graticule stroke={theme.colors.primary} />
                            <Sphere fill={theme.colors.background} />
                            <Raster
                                // clim={[vmin, vmax]}

                                clim={clim}
                                mode={'lut'}
                                nullValue={FILL_VALUE}
                                source={data}
                                colormap={colormap}
                            //  setLoading={setLoading}
                            />
                        </Minimap>
                    </Box>
                </Column>
            </Row>
        </>




    )
}

export default LeadTimesMap