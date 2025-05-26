import { Box, useThemeUI } from 'theme-ui'
import { Filter, Select, Row, Column } from '@carbonplan/components'
import TooltipWrapper from '../components/tooltip-wrapper'
import {
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from 'recharts'
import { useState } from 'react'

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

const RadialBarData = [
    {
        name: 'GraphCast',
        AE: 13.5,
        fill: '#8884d8',
    },
    {
        name: 'ECMWF AIFS',
        AE: 15.2,
        fill: '#FF746C',
    },
    {
        name: 'ECMWF IFS',
        AE: 20.1,
        fill: '#82ca9d',
    }
];




const RegionComparison = () => {

    const { theme } = useThemeUI()
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    const month_options = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December', 'All months'
    ]

    return (
        <>

            {/* Region Comparison - Title */}
            < Box sx={{
                pt: [2, 3, 4, 5],
                pb: [1, 2, 3, 4],

            }
            }>
                <TooltipWrapper
                    tooltip=' Compares the performance of the forecast models at the different forecast lead times of the selected month, averaged over all spatial points in the region.'
                >
                    <Box
                        sx={{
                            ...sx.heading,
                            //  fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'primary',



                        }}>
                        Region Comparison


                    </Box>
                </TooltipWrapper>
            </Box >

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',       // allows wrapping on small screens
                    gap: 6,                  // adds spacing between filters
                    // mt: 3,                   // margin above the filters
                    mb: 5,                   // margin below the filters
                    //  justifyContent: 'space-between', // distributes filters evenly along row
                    alignItems: 'center',    // vertically align filters
                }}
            >


                <Box>
                    <Filter
                        values={variables}
                        setValues={setVariables}
                        multiSelect={false}
                    />
                </Box>

                <Box>
                    <Filter
                        values={metrics}
                        setValues={setMetrics}
                        multiSelect={false}
                    // labels={{ q: 'Specific humidity' }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',       // allows wrapping on small screens
                        gap: 3,                  // adds spacing between selects

                        alignItems: 'center',    // vertically align selects
                    }}
                >

                    <Select size='xs'
                        sxSelect={{
                            textTransform: 'uppercase',
                            fontFamily: 'mono',
                            fontSize: [1, 1, 1, 2],
                            width: '100%',
                            //   pb: [1],
                        }}>
                        <option>2024</option>

                    </Select>



                    <Select
                        size='xs'
                        //  onChange={handleMonthChange}
                        sxSelect={{
                            textTransform: 'uppercase',
                            fontFamily: 'mono',
                            fontSize: [1, 1, 1, 2],
                            width: '100%',
                            //   pb: [1],
                        }}>
                        {month_options.map((month) => (
                            <option
                                key={month}
                                value={month}
                            >
                                {month}
                            </option>
                        ))}
                    </Select>
                </Box>
            </Box>




            <Row>
                <Column start={[1]} width={[3]}>
                    <Box sx={{
                        ...sx.subheading,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>Global</Box>
                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1],

                        pt: 20,
                        width: '100%',
                        height: 170
                    }}>

                        <ResponsiveContainer width="100%" >
                            <RadialBarChart
                                cx="50%"
                                cy="43%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={RadialBarData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: theme.colors.secondary }}
                                    clockWise
                                    dataKey="AE"
                                    label={{ position: 'insideStart', fill: theme.colors.primary }}
                                />

                            </RadialBarChart>
                        </ResponsiveContainer>
                    </Box>

                </Column>
                <Column start={[4]} width={[3]}>
                    <Box sx={{
                        ...sx.subheading,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>Tropics</Box>

                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1],

                        pt: 20,
                        width: '100%',
                        height: 170
                    }}>
                        <ResponsiveContainer width="100%" >
                            <RadialBarChart
                                cx="50%"
                                cy="43%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={RadialBarData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: theme.colors.secondary }}
                                    clockWise
                                    dataKey="AE"
                                    label={{ position: 'insideStart', fill: theme.colors.primary }}
                                />

                            </RadialBarChart>
                        </ResponsiveContainer>
                    </Box>

                </Column>
                <Column start={[7]} width={[3]}>
                    <Box sx={{
                        ...sx.subheading,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>Extra-Tropics</Box>

                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1],

                        pt: 20,
                        width: '100%',
                        height: 170
                    }}>

                        <ResponsiveContainer width="100%" >
                            <RadialBarChart
                                cx="50%"
                                cy="43%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={RadialBarData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: theme.colors.secondary }}
                                    clockWise
                                    dataKey="AE"
                                    label={{ position: 'insideStart', fill: theme.colors.primary }}
                                />

                            </RadialBarChart>
                        </ResponsiveContainer>
                    </Box>

                </Column>

                <Column start={[10]} width={[3]}>
                    <Box sx={{
                        ...sx.subheading,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>Africa</Box>

                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1],

                        pt: 20,
                        width: '100%',
                        height: 170
                    }}>

                        <ResponsiveContainer width="100%" >
                            <RadialBarChart
                                cx="50%"
                                cy="43%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={RadialBarData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: theme.colors.secondary }}
                                    clockWise
                                    dataKey="AE"
                                    label={{ position: 'insideStart', fill: theme.colors.primary }}
                                />


                            </RadialBarChart>
                        </ResponsiveContainer>
                    </Box>

                </Column>

            </Row>


            {/* Invisible Radial Bar Chart for Legend */}
            <Row>
                <Column start={[1]} width={[12]}>
                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1], display: 'flex', justifyContent: 'center'
                    }}>
                        <ResponsiveContainer width={300} height={20}>
                            <RadialBarChart
                                data={RadialBarData}
                                cx="50%"
                                cy="50%"
                                innerRadius="0%"
                                outerRadius="0%" // invisible chart
                                barSize={0}
                            >
                                <RadialBar
                                    dataKey="AE"
                                    fill={theme.colors.primary}
                                    // Invisible bar so nothing is shown
                                    background
                                    clockWise
                                />
                                <Legend
                                    iconSize={10}
                                    layout="horizontal"
                                    verticalAlign="middle"
                                    align="center"
                                    wrapperStyle={{
                                        paddingTop: 10,
                                    }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </Box>
                </Column>
            </Row>


        </>
    )
}

export default RegionComparison