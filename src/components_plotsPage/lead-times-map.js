import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Column, Filter } from '@carbonplan/components'
import { useState, useEffect, useMemo } from 'react'
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


const ZARR_SOURCE = 'https://dashboard-minimaps.s3.amazonaws.com/minimap_test_zlib_flipped_float32.zarr'
const VARIABLE = 't2m'
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
    const [time, setTime] = useState(0)
    const [chunks, setChunks] = useState(null)
    const [clim, setClim] = useState([0, 40]) // default clim for the colormap

    // for buttons UI only
    const [models, setModel] = useState({ GC: true, ECMWFIFS: false, ECMWFAIFS: false })
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    useEffect(() => {
        try {
            zarr().load(`${ZARR_SOURCE}/${VARIABLE}`, (err, arr) => {
                if (err) {
                    console.error('Error loading array:', err)
                    return
                }
                console.log('Loaded array:', arr)
                setChunks(arr)
            })
        } catch (error) {
            console.error('Error fetching group:', error)
        }
    }, [])

    const data = useMemo(() => {
        if (chunks) {
            return {
                rmse: chunks.pick(time, null, null), // time, lat, lon

            }
        } else {
            return {}
        }
    }, [chunks, time])

    useEffect(() => {
        console.log('Updated data:', data.rmse)
        if (data.rmse) {
            // Calculate the min and max values for the clim based on the data
            const arr = data.rmse
            const len = arr.size

            // Use ndarray-ops for min and max
            const min = ops.inf(arr)
            const max = ops.sup(arr)

            // Compute mean manually
            let sum = 0
            for (let i = 0; i < len; i++) {
                sum += arr.data[arr.index(i)]
            }
            const mean = sum / len

            console.log('Reconstructed stats:')
            console.log('Min:', min)
            console.log('Max:', max)
            console.log('Mean:', mean)
        }

    }, [data])


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
                                setValues={setVariables}
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

                    {/* Legend */}
                    <Box>

                        <Legend
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

                            //  color: 'primary',

                            pb: 30
                        }}
                    >
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
                                source={data.rmse}

                                colormap={colormap}
                            />
                        </Minimap>
                    </Box>
                </Column>
            </Row>
        </>




    )
}

export default LeadTimesMap

