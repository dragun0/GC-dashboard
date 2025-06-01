import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Filter, Select } from '@carbonplan/components'
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
import { useCallback, useState, useEffect } from 'react'

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

// recharts lead times plot (mock data)
const newdata = Array.from({ length: 41 }, (_, i) => {
    const x = i * 0.25;
    return {
        x,
        GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
        ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
        ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
    };
});


const LeadTimesPerformance = () => {

    const { theme } = useThemeUI()

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

    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

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

    const MODELS = ['gc', 'marsai', 'marsfc'];

    const [data, setData] = useState([]);
    const [selectedVariable, setSelectedVariable] = useState('t2m');
    const [selectedMetric, setSelectedMetric] = useState('rmse')
    const [selectedMonth, setSelectedMonth] = useState(13)

    const VARIABLE_UNITS = {
        u10: 'm/s',
        v10: 'm/s',
        t2m: '°C',
        msl: 'hPa',
        q: 'g/kg',
    };

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

    useEffect(() => {
        fetch('/plotsPageData/Global/R_RMSE_MAE_MBE_leadtimes_allmodels.json')
            .then((res) => res.json())
            .then((json) => {
                const filtered = json.filter(
                    (entry) =>
                        MODELS.includes(entry.model) &&
                        entry.month === selectedMonth &&
                        entry.metric === selectedMetric &&
                        entry[selectedVariable] !== null &&
                        typeof entry.time === 'number' // Ensure time is a number
                );
                //  console.log("Filtered data:", filtered)

                // Group by 'time' (0–40)
                const grouped = Array.from({ length: 41 }, (_, i) => {
                    const time = i; // Rescale: 0 to 10 in 0.25 steps
                    const timeData = { time };

                    MODELS.forEach((model) => {
                        const entry = filtered.find(
                            (d) => d.model === model && d.time === time
                        );
                        if (entry) {
                            timeData[model] = Number(entry[selectedVariable].toFixed(3)); // cap value to 3 decimal places
                        }
                    });
                    //  console.log("Month data:", monthData)

                    return timeData;
                });
                //  console.log("Grouped data:", grouped)
                setData(grouped);
            });
    }, [selectedVariable, selectedMetric, selectedMonth]);


    return (
        <>
            {/* Title Section - Lead Times Performance Title */}
            < Box sx={{
                pt: [3, 4, 5, 6],
                pb: [1, 2, 3, 4],

            }
            }>
                <TooltipWrapper
                    tooltip=' Compares the performance of the forecast models at the different forecast lead times
                     of the selected month, averaged over all spatial points in the region.'
                >
                    <Box
                        sx={{
                            ...sx.heading,
                            //  fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'blue',



                        }}>
                        Lead Times Performance


                    </Box>
                </TooltipWrapper>
            </Box >

            {/* Filters - Lead Times plot */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',       // allows wrapping on small screens
                    gap: 8,                  // adds spacing between filters
                    // mt: 3,                   // margin above the filters
                    // mb: 3,                   // margin below the filters

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

            {/* Lead times plot */}
            <Box sx={{
                ...sx.label,
                fontSize: [0, 0, 0, 1],
                //  color: 'primary',
                pt: 30,
                pb: 30

            }}

            >
                {/* Lead times plot */}

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        width={500}
                        height={200}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke={theme.colors.secondary} strokeWidth={0.15} />
                        <XAxis
                            dataKey="time"
                            tickFormatter={(tick) => (tick * 0.25).toFixed(1)} // Display as 0.0 – 10.0
                            ticks={[...Array(21).keys()].map(i => i * 2)} // Show ticks at 0, 0.5, 1.0, ..., 10.0
                            label={{

                                value: 'Lead Time (days)',
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
                        <Tooltip
                            labelFormatter={(label) => `Lead time: ${(label * 0.25).toFixed(2)}`}
                        />
                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} wrapperStyle={{ paddingTop: 30 }} />
                        <Line type="monotone" dataKey="marsai" name="ECMWF-AIFS" strokeOpacity={opacity.ecmwfAIFS} stroke="#FF746C" />
                        <Line type="monotone" dataKey="gc" name="GRAPHCAST" strokeOpacity={opacity.GraphCast} stroke="#8884d8" />
                        <Line type="monotone" dataKey="marsfc" name="ECMWF-IFS" strokeOpacity={opacity.ecmwfIFS} stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

        </>
    )
}

export default LeadTimesPerformance