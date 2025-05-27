import { Box, useThemeUI } from 'theme-ui'
import { useCallback, useState, useEffect } from 'react'
import { Filter, Select, Row, Column } from '@carbonplan/components'
import {
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from 'recharts'


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

/*
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
*/

const RegionOverview = () => {

    // UI states
    const { theme } = useThemeUI()
    // only necessary for highlighting the radio buttons
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

    // for the year and month select options
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
    const [selectedMetric, setSelectedMetric] = useState('RMSE')
    const [selectedMonth, setSelectedMonth] = useState(13)

    const [data, setData] = useState([]);

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
        fetch('/plotsPageData/Global/RMSE_monthly_allmodels.json')
            .then((res) => res.json())
            .then((json) => {
                const filtered = json.filter(
                    (entry) =>
                        MODELS.includes(entry.model) &&
                        entry.month === selectedMonth &&
                        entry[selectedVariable] !== null
                );
                console.log("Filtered data:", filtered)

                const transformed = filtered.map((entry) => ({
                    model: entry.model,
                    name: LEGEND_LABELS[entry.model] || entry.model, // will show in the legend: use the label from LEGEND_LABELS or fallback to the model name, 
                    value: Number(entry[selectedVariable].toFixed(3)),
                    fill: COLOR_MAP[entry.model] || '#ccc', // fallback color
                }));
                console.log("Transformed data:", transformed)
                setData(transformed);
            });
    }, [selectedVariable, selectedMonth]);



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
                        data={data}
                    >
                        <RadialBar
                            minAngle={15}
                            background={{ fill: theme.colors.secondary }}
                            clockWise
                            dataKey='value'
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
                        onChange={handleMonthChange}

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