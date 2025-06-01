import { Box, useThemeUI } from 'theme-ui'
import { Filter, Select, Row, Column } from '@carbonplan/components'
import TooltipWrapper from '../components/tooltip-wrapper'
import {
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from 'recharts'
import { useState, useCallback, useEffect } from 'react'

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

    // UI states
    const { theme } = useThemeUI()
    // only necessary for highlighting the radio buttons
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    // for the month select options
    const month_options = [
        'Annual', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    // function to convert month name to month code
    // (1 for January, 2 for February, ..., 12 for December, 13 for Annual)
    const getMonthCode = (monthName) => {
        if (monthName === 'Annual') return 13;

        // Remove 'Annual' from the array temporarily for index mapping
        const monthList = month_options.filter((m) => m !== 'Annual');
        const monthindex = monthList.indexOf(monthName);
        return monthindex >= 0 ? monthindex + 1 : null; // return 1–12 or null if not found
    };

    const [selectedVariable, setSelectedVariable] = useState('t2m')
    const [selectedMetric, setSelectedMetric] = useState('rmse')
    const [selectedMonth, setSelectedMonth] = useState(13)

    const [globalData, setGlobalData] = useState([]);

    // handle month change
    const handleMonthChange = useCallback((e) => {
        console.log('handleMonthChange', e.target.value)
        const month = e.target.value
        const monthCode = getMonthCode(month)
        setSelectedMonth(monthCode)
    }, [setSelectedMonth])

    // handle variable change
    const handleVariableChange = useCallback((e) => {
        console.log('handleVariableChange', e.target.value)
        const selectedVariable = e.target.value
        setSelectedVariable(selectedVariable)
    }, [setSelectedVariable])

    // handle metric change
    const handleMetricChange = useCallback((e) => {
        console.log('handleMetricChange', e.target.value)
        const selectedMetric = e.target.value.toLowerCase()
        setSelectedMetric(selectedMetric)
    }, [setSelectedMetric])


    //  for structuring the json data
    const MODELS = ['gc', 'marsai', 'marsfc'];

    // adds a fill value for each model in the json data
    // used to color the radial bar chart
    const COLOR_MAP = {
        gc: '#8884d8',
        marsai: '#FF746C',
        marsfc: '#82ca9d',
    };

    const LEGEND_LABELS = {
        gc: 'GraphCast',
        marsai: 'ECMWF-AIFS',
        marsfc: 'ECMWF-IFS',
    };

    useEffect(() => {
        fetch('/plotsPageData/Global/R_RMSE_MAE_MBE_monthly_allmodels.json')
            .then((res) => res.json())
            .then((json) => {
                const filtered = json.filter(
                    (entry) =>
                        MODELS.includes(entry.model) &&
                        entry.month === selectedMonth &&
                        entry.metric === selectedMetric &&
                        entry[selectedVariable] !== null
                );
                //  console.log("Filtered data:", filtered)

                const transformed = filtered.map((entry) => ({
                    model: entry.model,
                    name: LEGEND_LABELS[entry.model] || entry.model, // will show in the legend: use the label from LEGEND_LABELS or fallback to the model name, 
                    value: Number(entry[selectedVariable].toFixed(3)),
                    fill: COLOR_MAP[entry.model] || '#ccc', // fallback color
                }));
                //   console.log("Transformed data:", transformed)
                setGlobalData(transformed);
            });
    }, [selectedVariable, selectedMonth, selectedMetric]);



    return (
        <>

            {/* Region Comparison - Title */}
            < Box sx={{
                pt: [2, 3, 4, 5],
                pb: [1, 2, 3, 4],

            }
            }>
                <TooltipWrapper
                    tooltip=' An overview of how the different forecasting models are performing across four spatial extents. The selected verification metric is computed across
                    all leadtimes and spatial points (within the geographic extent) for the selected month. "Annual" represents the average value of that metric across the whole year.
                    '
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

                <Box>
                    <Filter
                        values={metrics}
                        setValues={(newMetric) => {
                            // highlight the selected metric
                            setMetrics(newMetric)
                            // Call handleMetricChange when the filter changes
                            const selectedMetric = Object.keys(newMetric).find(key => newMetric[key]);
                            if (selectedMetric) {
                                handleMetricChange({ target: { value: selectedMetric } })
                            }
                        }}
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
                        onChange={handleMonthChange}
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
                                data={globalData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: theme.colors.secondary }}
                                    clockWise
                                    dataKey="value"
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
                                data={globalData}
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