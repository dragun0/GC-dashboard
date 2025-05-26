import { Box, useThemeUI } from 'theme-ui'
import { Filter, Select, Row, Column } from '@carbonplan/components'
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

const RegionOverview = () => {

    const { theme } = useThemeUI()
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    const month_options = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December', 'All months'
    ]

    return (
        <>
            {/* Overall Ranking Plot (circle) */}
            <Box sx={{
                ...sx.label,
                fontSize: [0, 0, 0, 1],

                pb: 30,
                width: '100%',
                height: 280
            }}>

                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="43%"
                        innerRadius="40%"
                        outerRadius="90%"
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
                        <Legend
                            iconSize={3}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                                paddingTop: 10,

                            }}

                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: [0, 1, 2, 3] }}>
                <Filter
                    values={variables}
                    setValues={setVariables}
                    multiSelect={false}
                // labels={{ q: 'Specific humidity' }}
                />
            </Box>
            <Box sx={{ mt: [0, 1, 2, 3] }}>
                <Filter
                    values={metrics}
                    setValues={setMetrics}
                    multiSelect={false}
                // labels={{ q: 'Specific humidity' }}
                />
            </Box>
            <Row sx={{ mt: [0, 1, 2, 3] }}>
                <Column start={[1]} width={[3, 3, 3, 3]}>
                    <Select size='xs'
                        sxSelect={{
                            textTransform: 'uppercase',
                            fontFamily: 'mono',
                            fontSize: [1, 1, 1, 2],
                            width: '100%',
                            pb: [1],
                        }}>
                        <option>2024</option>

                    </Select>
                </Column>

                <Column start={[4]} width={[4, 4, 4, 4]}>
                    <Select
                        size='xs'
                        //  onChange={handleMonthChange}
                        sxSelect={{
                            textTransform: 'uppercase',
                            fontFamily: 'mono',
                            fontSize: [1, 1, 1, 2],
                            width: '100%',
                            pb: [1],
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
                </Column>
            </Row>

        </>
    )
}

export default RegionOverview