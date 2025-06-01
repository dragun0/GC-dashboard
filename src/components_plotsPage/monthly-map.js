import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Column, Filter } from '@carbonplan/components'
import { useState } from 'react'
import { Minimap, Raster, Path, Sphere, Graticule } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import MonthSlider from '../components_plotsPage/month-slider'

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


const MonthlyMap = () => {
    const { theme } = useThemeUI()
    const colormap = useThemedColormap('fire')

    const [models, setModel] = useState({ GC: true, ECMWFIFS: false, ECMWFAIFS: false })
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    return (
        <>
            {/* Title Section - Monthly Spatial Performance */}
            <Box sx={{
                pt: 50,
                pb: [1, 2, 3, 4],

            }}>
                <TooltipWrapper
                    tooltip=' Visualises the performance of the selected forecast model in different parts of the 
                    regional extent at each month of the year 2024. The monthly values are computed over all lead times for that month.
                    Each pixel in this map answers the question: "On average across the selected month, how wrong is the model at this location?"'
                >
                    <Box
                        sx={{
                            ...sx.heading,
                            //   fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'blue',



                        }}>
                        Monthly Spatial Performance


                    </Box>
                </TooltipWrapper>
            </Box>

            {/* Months slider */}
            <Box sx={{
                mt: 2,
                mb: 2,
            }}>
                <MonthSlider

                    max={12}
                    delay={400}
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
                </Column>

                {/* Right column: Minimap */}
                <Column start={[3]} width={[10]}>
                    <Box
                        sx={{

                            //  color: 'primary',

                            pb: 30
                        }}
                    >
                        <Minimap projection={naturalEarth1}>
                            <Path
                                stroke={theme.colors.primary}
                                source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
                                feature={'land'}
                            />
                            <Graticule stroke={theme.colors.primary} />
                            <Sphere fill={theme.colors.background} />
                            <Raster
                                clim={[0, 50000000]}
                                mode='lut'
                                nullValue={9.969209968386869e36}
                                source={
                                    'https://carbonplan-climatetrace.s3.us-west-2.amazonaws.com/v0.4/blog/total_emissions.zarr'
                                }
                                variable={'emissions'}
                                colormap={colormap}
                            />
                        </Minimap>
                    </Box>
                </Column>
            </Row>

        </>
    )
}

export default MonthlyMap