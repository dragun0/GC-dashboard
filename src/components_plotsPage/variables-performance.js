import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Select } from '@carbonplan/components'
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


const VariablesPerformance = () => {

    const { theme } = useThemeUI()

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

    const [selectedMonth, setSelectedMonth] = useState(13)
    const [globalRData, setGlobalRData] = useState([]);

    // handle month change
    const handleMonthChange = useCallback((e) => {
        console.log('handleMonthChange', e.target.value)
        const month = e.target.value
        const monthCode = getMonthCode(month)
        setSelectedMonth(monthCode)
    }, [setSelectedMonth])

    //  for structuring the json data
    //const MODELS = ['gc', 'marsai', 'marsfc'];

    useEffect(() => {
        if (selectedMonth) {
            fetch('/plotsPageData/Global/PearsonR_monthly_allmodels.json')
                .then((res) => res.json())
                .then((json) => {
                    const filtered = json.filter((entry) => entry.month === selectedMonth);

                    const variables = ['u10', 'v10', 't2m', 'msl', 'q'];

                    console.log("Filtered data:", filtered);

                    const formatted = variables.map((variable) => {
                        const entry = { variable }; // x-axis key
                        filtered.forEach((item) => {
                            entry[item.model] = item[variable];
                        });
                        return entry;
                    });
                    console.log("Formatted data:", formatted);
                    setGlobalRData(formatted);
                })
                .catch((error) => {
                    console.error('Failed to load or process data.json:', error);
                });
        }
    }, [selectedMonth]);




    return (
        <>
            {/* Title Section - Variables Performance */}
            <Box sx={{
                pt: [3, 4, 5, 6],
                pb: [1, 2, 3, 4],

            }}>
                <TooltipWrapper
                    tooltip=' Visualises the performance of the selected forecast model in different parts of the regional extent averaged over all lead times of the selected month.'
                >
                    <Box
                        sx={{
                            ...sx.heading,
                            //    fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'blue',

                        }}>
                        Variables Performance

                    </Box>
                </TooltipWrapper>
            </Box>


            {/* Filters - Variable performances plot */}
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