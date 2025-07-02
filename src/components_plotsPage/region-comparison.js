import { Box, useThemeUI, Divider } from 'theme-ui'
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

    const REGION_CONFIGS = [
        { title: 'Global', key: 'globalData', file: '/plotsPageData/Global/R_RMSE_MAE_MBE_monthly_allmodels.json' },
        { title: 'Tropics', key: 'tropicsData', file: '/plotsPageData/Tropics/Tropics_R_RMSE_MAE_MBE_monthly_allmodels.json' },
        { title: 'Subtropics', key: 'subtropicsData', file: '/plotsPageData/Subtropics/Subtropics_R_RMSE_MAE_MBE_monthly_allmodels.json' },
        { title: 'N. Temperate', key: 'temperateData', file: '/plotsPageData/NTemperate/NTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json' },
        { title: '(Sub-)Polar', key: 'polarData', file: '/plotsPageData/Polar/Polar_R_RMSE_MAE_MBE_monthly_allmodels.json' },
        { title: 'Africa', key: 'africaData', file: '/plotsPageData/Africa/Africa_R_RMSE_MAE_MBE_monthly_allmodels.json' },
    ]

    const [regionData, setRegionData] = useState({
        globalData: [],
        tropicsData: [],
        subtropicsData: [],
        temperateData: [],
        polarData: [],
        africaData: [],
    });


    const MAX_VALUES = {
        rmse: {
            t2m: 5,
            msl: 9,
            u10: 4.5,
            v10: 4.5,
            q: 2,
        },
        mae: {
            t2m: 5,
            msl: 9,
            u10: 4.5,
            v10: 4.5,
            q: 2,
        },
        mbe: {
            t2m: 0.5,
            msl: 2.7,
            u10: 0.5,
            v10: 0.5,
            q: 1.5,
        },
        r: {
            t2m: 1,
            msl: 1,
            u10: 1,
            v10: 1,
            q: 1,
        },
    }


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

    // for the invisible bar chart that is only used as a legend
    const [globalData, setGlobalData] = useState([]);

    const maxChartValue = MAX_VALUES[selectedMetric]?.[selectedVariable] ?? 7;

    // handle month change
    const handleMonthChange = useCallback((e) => {
        const month = e.target.value
        const monthCode = getMonthCode(month)
        setSelectedMonth(monthCode)
    }, [setSelectedMonth])

    // handle variable change
    const handleVariableChange = useCallback((e) => {
        const selectedVariable = e.target.value
        setSelectedVariable(selectedVariable)
    }, [setSelectedVariable])

    // handle metric change
    const handleMetricChange = useCallback((e) => {
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
        const fetchAllRegionData = async () => {
            const updatedData = {};

            for (const { key, file } of REGION_CONFIGS) {
                try {
                    const res = await fetch(file);
                    const json = await res.json();

                    const filtered = json.filter(
                        (entry) =>
                            MODELS.includes(entry.model) &&
                            entry.month === selectedMonth &&
                            entry.metric === selectedMetric &&
                            entry[selectedVariable] !== null
                    );

                    const transformed = [
                        ...filtered.map((entry) => ({
                            model: entry.model,
                            name: LEGEND_LABELS[entry.model] || entry.model,
                            value: Number(entry[selectedVariable].toFixed(3)),
                            fill: COLOR_MAP[entry.model] || '#ccc',
                            invisible: false,
                        })),
                        {
                            model: 'max-scaler',
                            name: '',
                            value: maxChartValue,
                            fill: theme.colors.background,
                            //background: { fill: 'none' },

                            invisible: true, // custom flag to identify and filter later
                        }
                    ];

                    updatedData[key] = transformed;
                } catch (error) {
                    console.error(`Failed to fetch data for ${key}:`, error);
                    updatedData[key] = []; // fallback empty
                }
            }

            setRegionData(updatedData);
        };

        fetchAllRegionData();
    }, [selectedVariable, selectedMonth, selectedMetric]);



    return (
        <>

            {/* Region Comparison - Title */}
            <Divider />
            < Box sx={{
                pt: [1, 2, 3, 4],
                pb: [1, 2, 3, 4],

            }
            }>

                <TooltipWrapper
                    tooltip=' An overview of how the forecasting models are performing across different geographic climate zones. The selected verification metric is computed across
                    all leadtimes and spatial points (within the geographic extent) for the selected month and the selected variable. "Annual" represents the average value of that metric across the whole year.
                    '
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 7,
                            width: '100%',
                        }}
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

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',       // allows wrapping on small screens
                                gap: 6,                  // adds spacing between filters
                                // mt: 3,                   // margin above the filters
                                mb: 2,                   // margin below the filters
                                //    justifyContent: 'space-between', // distributes filters evenly along row
                                alignItems: 'center',    // vertically align filters
                            }}
                        >


                            <Box>
                                <Filter
                                    values={variables}
                                    setValues={(newVariable) => {
                                        // highlight the selected variable
                                        setVariables(newVariable)
                                        // Call handleVariableChange when the filter changes
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
                    </Box>

                </TooltipWrapper>
            </Box >





            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap', // prevents wrapping
                    width: '100%',
                }}
            >
                {REGION_CONFIGS.map(({ title, key }) => (
                    <Box
                        key={key}
                        sx={{
                            flex: '1 1 0',
                            maxWidth: `${100 / REGION_CONFIGS.length}%`, // = ~16.666% for 6 charts
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ ...sx.subheading, display: 'flex', justifyContent: 'center', mb: 2 }}>
                            {title}
                        </Box>
                        <Box
                            sx={{
                                ...sx.label,
                                fontSize: [0, 0, 0, 1],
                                width: '100%',
                                height: 170,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="43%"
                                    innerRadius="30%"
                                    outerRadius="100%"
                                    barSize={20}
                                    data={regionData[key]} // includes real values + max-scaler
                                >
                                    {/* Main bars: exclude max-scaler using invisible flag */}

                                    <RadialBar
                                        minAngle={15}

                                        background={{ fill: theme.colors.secondary }}
                                        clockWise
                                        dataKey="value"
                                        label={{
                                            position: 'insideStart',
                                            fill: theme.colors.background,
                                        }}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                ))}

            </Box>


            {/* Invisible Radial Bar Chart for Legend */}
            <Row>
                <Column start={[1]} width={[12]}>
                    <Box sx={{
                        ...sx.label,
                        fontSize: [0, 0, 0, 1], display: 'flex', justifyContent: 'center'
                    }}>
                        <ResponsiveContainer width={300} height={20}>
                            <RadialBarChart
                                data={regionData.globalData}
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
                                        paddingTop: 0,
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