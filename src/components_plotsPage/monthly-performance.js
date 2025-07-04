
import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Filter, Column, Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'
import { useCallback } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useState, useEffect } from 'react'


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


const MonthlyPerformance = (props) => {

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
    else if (region === 'polar') JSON_PATH = '/plotsPageData/Polar/Polar_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'africa') JSON_PATH = '/plotsPageData/Africa/Africa_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate' && selectedTemperateExtent == 'northtemperate') JSON_PATH = '/plotsPageData/NTemperate/NTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate' && selectedTemperateExtent == 'southtemperate') JSON_PATH = '/plotsPageData/STemperate/SouthernTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';

    // UI states
    const { theme } = useThemeUI()

    // only necessary for highlighting the radio buttons
    const [variables, setVariables] = useState({ t2m: false, msl: false, u10: false, v10: false, q: true })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })
    const [extent, setExtent] = useState({ tropics: true, subtropics: false })

    const [TemperateExtent, setTemperateExtent] = useState({ northtemperate: true, southtemperate: false })

    //  for structuring the json data
    const MODELS = ['gc', 'marsai', 'marsfc'];

    const [data, setData] = useState([]);
    const [selectedVariable, setSelectedVariable] = useState('q');
    const [selectedMetric, setSelectedMetric] = useState('rmse')

    const VARIABLE_UNITS = {
        u10: 'm/s',
        v10: 'm/s',
        t2m: '°C',
        msl: 'hPa',
        q: 'g/kg',
    };

    // handle tropics extent change (tropics or subtropics)
    const handleExtentChange = useCallback((e) => {
        const newExtent = e.target.value
        setSelectedExtent(newExtent)
    }, [setSelectedExtent])

    // handle temperate extent change (north or south)
    const handleTemperateExtentChange = useCallback((e) => {
        const newTemperateExtent = e.target.value
        setSelectedTemperateExtent(newTemperateExtent)
    }, [setSelectedTemperateExtent])

    // handle variable change
    const handleVariableChange = useCallback((e) => {
        //  console.log('handleVariableChange', e.target.value)
        const selectedVariable = e.target.value
        setSelectedVariable(selectedVariable)
    }, [setSelectedVariable])

    // handle metric change
    const handleMetricChange = useCallback((e) => {
        //   console.log('handleMetricChange', e.target.value)
        const selectedMetric = e.target.value.toLowerCase()
        setSelectedMetric(selectedMetric)
    }, [setSelectedMetric])

    useEffect(() => {
        fetch(JSON_PATH)
            .then((res) => res.json())
            .then((json) => {
                const filtered = json.filter(
                    (entry) =>
                        MODELS.includes(entry.model) &&
                        entry.month >= 1 &&
                        entry.month <= 12 && // do not include the "13th" month (average over the year)
                        entry.metric === selectedMetric &&
                        entry[selectedVariable] !== null
                );

                const grouped = Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const monthData = { month };

                    MODELS.forEach((model) => {
                        const entry = filtered.find(
                            (d) => d.model === model && d.month === month
                        );
                        if (entry) {
                            monthData[model] = Number(entry[selectedVariable].toFixed(3)); // Ensure the value is a number
                        }
                    });
                    //  console.log("Month data:", monthData)

                    return monthData;
                });
                //  console.log("Grouped data:", grouped)
                setData(grouped);
            });
    }, [selectedVariable, selectedMetric, selectedExtent, selectedTemperateExtent, region]);


    // download the graph data as a CSV file
    const handleDownloadCSV = () => {

        const headerMap = {
            month: 'Month',
            gc: 'GraphCast',
            marsai: 'ECMWF-AIFS',
            marsfc: 'ECMWF-IFS',
        }

        if (!data || data.length === 0) return

        const headers = Object.keys(headerMap)
        const headerLabels = headers.map(key => headerMap[key])

        const csvRows = [
            headerLabels.join(','), // custom header row
            ...data.map(row =>
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
        a.download = `${regionString}_2024_${selectedMetric}_${selectedVariable}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }


    {/* for graph legend */ }
    const [opacity, setOpacity] = useState({
        GraphCast: 1,
        ecmwfIFS: 1,
        ecmwfAIFS: 1,
    });

    const handleMouseEnter = (o) => {
        const { dataKey } = o;

        setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
    };

    const handleMouseLeave = (o) => {
        const { dataKey } = o;

        setOpacity((op) => ({ ...op, [dataKey]: 1 }));
    };



    return (
        <>

            <Box sx={{
                pt: [0],
                pb: [0],

            }}>
                <TooltipWrapper
                    tooltip=' Compares the performance of the different forecast models at each month of the year 2024. 
                    The monthly values are computed across all spatial points in the region and leadtimes of the month.'

                >
                    <Column>
                        {/* show tropics or subtropics filter if overall region is = tropics */}
                        {region === 'tropics' && (
                            <Filter
                                sx={{
                                    pr: 1,

                                }}
                                values={extent}
                                setValues={(newExtent) => {
                                    // highlight the selected extent
                                    setExtent(newExtent)
                                    // Call handleVariableChange when the filter changes
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
                                    // Call handleVariableChange when the filter changes
                                    const selExtent = Object.keys(newTemperateExtent).find(key => newTemperateExtent[key]);
                                    if (selExtent) {
                                        handleTemperateExtentChange({ target: { value: selExtent } })
                                    }
                                }}
                                multiSelect={false}
                                labels={{ northtemperate: 'North Temperate', southtemperate: 'South Temperate' }}

                            />


                        )}


                        {/* Variables and Metrics Filters */}

                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 3,


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


                            <Box >
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

                        </Box>
                    </Column>
                </TooltipWrapper>
            </Box >




            <Box sx={{
                ...sx.label,
                fontSize: [0, 0, 0, 1],

                pt: 30,
                pb: 30

            }}

            >
                {/* Months plot */}

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        width={500}
                        height={200}
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke={theme.colors.secondary} strokeWidth={0.15} />
                        <XAxis dataKey="month"
                            label={{
                                value: 'Month',
                                position: 'insideBottom',
                                offset: 0,
                                dy: 10,
                            }}
                        />
                        <YAxis
                            label={
                                ['rmse', 'mae', 'mbe'].includes(selectedMetric)
                                    ? {
                                        value: VARIABLE_UNITS[selectedVariable] || '',
                                        angle: -90,
                                        position: 'insideLeft',
                                        dx: 0,
                                    }
                                    : undefined
                            }
                        />
                        <Tooltip />
                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} wrapperStyle={{ paddingTop: 30 }} />
                        <Line type="monotone" dataKey="marsai" name="ECMWF-AIFS" strokeOpacity={opacity.ecmwfAIFS} stroke="#FF746C" />
                        <Line type="monotone" dataKey="gc" name="GRAPHCAST" strokeOpacity={opacity.GraphCast} stroke="#8884d8" />
                        <Line type="monotone" dataKey="marsfc" name="ECMWF-IFS" strokeOpacity={opacity.ecmwfIFS} stroke="#82ca9d" />


                    </LineChart>
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


            </Box>
        </>
    )
}

export default MonthlyPerformance

