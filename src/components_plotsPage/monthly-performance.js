import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Filter } from '@carbonplan/components'
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

// months time series plot (mock data)
const MonthsData = Array.from({ length: 12 }, (_, x) => ({
    x,
    GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
    ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
    ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
}));


const MonthlyPerformance = () => {

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

    return (
        <>
            {/* Title Section - Monthly Performance */}
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
                            //   fontFamily: 'mono',
                            textTransform: 'uppercase',
                            color: 'blue',

                        }}>
                        Monthly Performance


                    </Box>
                </TooltipWrapper>
            </Box>


            {/* Filters - Monthly performances plot */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',       // allows wrapping on small screens
                    gap: 6,                  // adds spacing between filters
                    // mt: 3,                   // margin above the filters
                    // mb: 3,                   // margin below the filters
                    //  justifyContent: 'space-between', // Distributes filters evenly across the row
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
            </Box>

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
                        data={MonthsData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke={theme.colors.secondary} strokeWidth={0.15} />
                        <XAxis dataKey="x"
                            label={{
                                value: 'Month',
                                position: 'insideBottom',
                                offset: 0,
                                dy: 10,
                            }}
                        />
                        <YAxis label={{
                            value: '°C',
                            angle: -90,
                            position: 'insideLeft',
                            dx: 0,
                        }}
                        />
                        <Tooltip />
                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} wrapperStyle={{ paddingTop: 30 }} />
                        <Line type="monotone" dataKey="GraphCast" strokeOpacity={opacity.GraphCast} stroke="#8884d8" />
                        <Line type="monotone" dataKey="ecmwfIFS" strokeOpacity={opacity.ecmwfIFS} stroke="#82ca9d" />
                        <Line type="monotone" dataKey="ecmwfAIFS" strokeOpacity={opacity.ecmwfAIFS} stroke="#FF746C" />
                    </LineChart>
                </ResponsiveContainer>


            </Box>
        </>
    )
}

export default MonthlyPerformance