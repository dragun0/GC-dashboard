import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Select, Filter, Row, Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
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

const StackedBarData = [
    {
        name: 't2m',
        GraphCast: 4000,
        ecmwfIFS: 2400,
        ecmwfAIFS: 2400,
    },
    {
        name: 'msl',
        GraphCast: 3000,
        ecmwfIFS: 1398,
        ecmwfAIFS: 2210,
    },
    {
        name: 'u10',
        GraphCast: 2000,
        ecmwfIFS: 9800,
        ecmwfAIFS: 2290,
    },
    {
        name: 'v10',
        GraphCast: 2780,
        ecmwfIFS: 3908,
        ecmwfAIFS: 2000,
    },
    {
        name: 'Q',
        GraphCast: 1890,
        ecmwfIFS: 4800,
        ecmwfAIFS: 2181,
    },
]


const VariablesPerformance = (props) => {

    const {
        region
    } = props

    // keep track of the actual extent selected (for the tropics section)
    const [selectedExtent, setSelectedExtent] = useState('tropics');

    // keep track of the actual temperate extent selected (for the temperate zones section)
    const [selectedTemperateExtent, setSelectedTemperateExtent] = useState('northtemperate');

    let JSON_PATH = '';
    if (region === 'global') JSON_PATH = '/plotsPageData/Global/R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'tropics') JSON_PATH = '/plotsPageData/Tropics/Tropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'subtropics') JSON_PATH = '/plotsPageData/Subtropics/Subtropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate' && selectedTemperateExtent == 'northtemperate') JSON_PATH = '/plotsPageData/NTemperate/NTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate' && selectedTemperateExtent == 'southtemperate') JSON_PATH = '/plotsPageData/STemperate/SouthernTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'polar') JSON_PATH = '/plotsPageData/Polar/Polar_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'africa') JSON_PATH = '/plotsPageData/Africa/Africa_R_RMSE_MAE_MBE_monthly_allmodels.json';

    const { theme } = useThemeUI()

    // for the month select options
    const month_options = [
        'Annual', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]


    // UI radio buttons
    const [extent, setExtent] = useState({ tropics: true, subtropics: false })

    const [TemperateExtent, setTemperateExtent] = useState({ northtemperate: true, southtemperate: false })


    // handle extent change for tropics or subtropics
    const handleExtentChange = useCallback((e) => {
        const newExtent = e.target.value
        setSelectedExtent(newExtent)
    }, [setSelectedExtent])

    // handle temperate extent change (north or south)
    const handleTemperateExtentChange = useCallback((e) => {
        const newTemperateExtent = e.target.value
        setSelectedTemperateExtent(newTemperateExtent)
    }, [setSelectedTemperateExtent])



    // function to convert month name to month code
    // (1 for January, 2 for February, ..., 12 for December, 13 for Annual)
    const getMonthCode = (monthName) => {
        if (monthName === 'Annual') return 13;

        // Remove 'Annual' from the array temporarily for index mapping
        const monthList = month_options.filter((m) => m !== 'Annual');
        const monthindex = monthList.indexOf(monthName);
        return monthindex >= 0 ? monthindex + 1 : null; // return 1–12 or null if not found
    };

    const [selectedMonth, setSelectedMonth] = useState(13)
    const [globalRData, setGlobalRData] = useState([]);


    // handle month change
    const handleMonthChange = useCallback((e) => {
        //   console.log('handleMonthChange', e.target.value)
        const month = e.target.value
        const monthCode = getMonthCode(month)
        setSelectedMonth(monthCode)
    }, [setSelectedMonth])

    // For CSV file name
    const getMonthName = (monthCode) => {
        if (monthCode === 13) return 'Annual';

        // Remove 'Annual' from the month list to align indices
        const monthList = month_options.filter((m) => m !== 'Annual');

        // Valid monthCode is from 1 to 12
        return (monthCode >= 1 && monthCode <= 12) ? monthList[monthCode - 1] : null;
    };


    // download the graph data as a CSV file
    const handleDownloadCSV = () => {

        const headerMap = {
            variable: 'variable',
            gc: 'GraphCast',
            marsai: 'ECMWF-AIFS',
            marsfc: 'ECMWF-IFS',
        }

        if (!globalRData || globalRData.length === 0) return

        const headers = Object.keys(headerMap)
        const headerLabels = headers.map(key => headerMap[key])


        const csvRows = [
            headerLabels.join(','), // custom header row
            ...globalRData.map(row =>
                headers.map(field => {
                    return JSON.stringify(row[field] ?? '')
                }).join(',')
            )
        ]

        const csvContent = csvRows.join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        let regionString = ''
        if (region === 'tropics') {
            regionString = selectedExtent
        } else if (region === 'temperate') {
            regionString = selectedTemperateExtent
        } else {
            regionString = region
        }

        const a = document.createElement('a')
        a.href = url
        a.download = `${regionString}_CorrelationCoefficient_${getMonthName(selectedMonth)}_2024.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }



    //  for structuring the json data
    //const MODELS = ['gc', 'marsai', 'marsfc'];

    useEffect(() => {
        if (selectedMonth) {
            fetch(JSON_PATH)
                .then((res) => res.json())
                .then((json) => {
                    const variables = ['u10', 'v10', 't2m', 'msl', 'q'];
                    const filtered = json.filter(
                        (entry) =>
                            entry.month === selectedMonth &&
                            entry.metric === 'r' &&
                            variables.every((variable) => entry[variable] !== null)
                    );


                    // console.log("Filtered data:", filtered);

                    const formatted = variables.map((variable) => {
                        const entry = { variable }; // x-axis key
                        filtered.forEach((item) => {
                            entry[item.model] = Number(item[variable]?.toFixed(4));
                        });
                        return entry;
                    });
                    //   console.log("Formatted data:", formatted);
                    setGlobalRData(formatted);
                })
                .catch((error) => {
                    console.error('Failed to load or process data.json:', error);
                });
        }
    }, [selectedMonth, selectedExtent, selectedTemperateExtent, region]);




    return (
        <>

            <Box sx={{
                pt: [1],
                pb: [1],

            }}>
                <TooltipWrapper
                    tooltip=' Compares the correlation coefficient of each variable of the forecasting models
                    for each selected month or across the whole year (annual). The correlation coefficient value of each variable is calculated
                    across all lead times and spatial points in the region.'
                >

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',       // allows wrapping on small screens
                            gap: 3,                  // adds spacing between filters
                            // mt: 3,                   // margin above the filters
                            // mb: 3,                   // margin below the filters
                            justifyContent: 'space-between', // Distributes filters evenly across the row
                            alignItems: 'center',    // vertically align filters
                        }}
                    >
                        {/* tropics or subtropics filter if region = tropics */}

                        {region == 'tropics' && (
                            <Filter
                                sx={{
                                    pr: 1,


                                }}
                                values={extent}
                                setValues={(newExtent) => {
                                    // highlight the selected extent
                                    setExtent(newExtent)
                                    //Call handleVariableChange when the filter changes
                                    const selExtent = Object.keys(newExtent).find(key => newExtent[key]);
                                    if (selExtent) {
                                        handleExtentChange({ target: { value: selExtent } })
                                    }
                                }}
                                multiSelect={false}


                            />
                        )}

                        {/* show north or south temperate filter if overall region is = temperate */}
                        {region === 'temperate' && (


                            <Filter
                                sx={{
                                    pr: 1,

                                }}
                                values={TemperateExtent}
                                setValues={(newTemperateExtent) => {
                                    // highlight the selected extent
                                    setTemperateExtent(newTemperateExtent)
                                    //Call handleVariableChange when the filter changes
                                    const selExtent = Object.keys(newTemperateExtent).find(key => newTemperateExtent[key]);
                                    if (selExtent) {
                                        handleTemperateExtentChange({ target: { value: selExtent } })
                                    }
                                }}
                                multiSelect={false}
                                labels={{ northtemperate: 'North Temp', southtemperate: 'South Temp' }}

                            />


                        )}






                        {/* year and month filters */}
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
                                    fontSize: [1],
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

                </TooltipWrapper>
            </Box>






            <Box sx={{
                ...sx.label,
                fontSize: [0, 0, 0, 1],

                pt: 30,
                pb: 30

            }}

            >
                {/* Variables plot stacked bars */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={200}
                        data={globalRData}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke={theme.colors.secondary} vertical={false} strokeWidth={0.15} />
                        <XAxis dataKey="variable"
                            label={{
                                value: 'Variable',
                                position: 'insideBottom',
                                offset: 0,
                                dy: 10,
                            }} />
                        <YAxis label={{
                            value: 'Correlation Coefficient',
                            angle: -90,
                            position: 'insideLeft',
                            dy: 80,
                            dx: 0,
                        }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: 30 }} />
                        <Bar dataKey="gc" name="GRAPHCAST" stackId="a" fill="#8884d8" />
                        <Bar dataKey="marsfc" name="ECMWF-IFS" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="marsai" name="ECMWF-AIFS" stackId="a" fill="#FF746C" />

                    </BarChart>
                    <Row
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            my: 3,
                        }}
                    >
                        <Button
                            inverted
                            onClick={handleDownloadCSV}
                            size='xs'
                            sx={{
                                fontSize: [1, 1, 1, 2],
                                textTransform: 'uppercase',
                                fontFamily: 'mono',
                                letterSpacing: 'mono',
                                minWidth: '120px',
                                textAlign: 'right',
                                whiteSpace: 'nowrap',
                                '&:disabled': {
                                    color: 'muted',
                                    pointerEvents: 'none',
                                },
                            }}
                            prefix={<Down />}
                        >
                            Download CSV
                        </Button>
                    </Row>

                </ResponsiveContainer>

                {/* CarbonPlans - Variable Stacked plot 

        <Chart x={[-1, 4]} y={[0, 100]} padding={{ left: 60, top: 50, right: 10 }}>
            <Ticks left  />
            <TickLabels left  />
            <Axis left bottom />
            <AxisLabel left>Evaluation metric</AxisLabel>
            
            <Plot>
            <StackedBar data={StackedBarChartData} color={'purple'} />
            </Plot>
        </Chart>
            */}

            </Box>

        </>
    )
}

export default VariablesPerformance