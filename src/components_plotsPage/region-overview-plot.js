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



const RegionOverview = (props) => {

    const {
        region
    } = props

    // keep track of the actual extent selected (for the tropics section)
    const [selectedExtent, setSelectedExtent] = useState('tropics');

    let JSON_PATH = '';
    if (region === 'global') JSON_PATH = '/plotsPageData/Global/R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'tropics') JSON_PATH = '/plotsPageData/Tropics/Tropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'subtropics') JSON_PATH = '/plotsPageData/Subtropics/Subtropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate') JSON_PATH = '/plotsPageData/NTemperate/NTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'polar') JSON_PATH = '/plotsPageData/Polar/Polar_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'africa') JSON_PATH = '/plotsPageData/Africa/Africa_R_RMSE_MAE_MBE_monthly_allmodels.json';


    const MAX_VALUES = {
        rmse: {
            t2m: 7,
            msl: 10,
            u10: 5,
            v10: 5,
            q: 2,
        },
        mae: {
            t2m: 6,
            msl: 9,
            u10: 4,
            v10: 4,
            q: 1.8,
        },
        mbe: {
            t2m: 1,
            msl: 8,
            u10: 3.5,
            v10: 3.5,
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
    const [extent, setExtent] = useState({ tropics: true, subtropics: false })

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
    const [selectedMetric, setSelectedMetric] = useState('rmse')
    const [selectedMonth, setSelectedMonth] = useState(13)

    const [data, setData] = useState([]);

    const maxChartValue = MAX_VALUES[selectedMetric]?.[selectedVariable] ?? 7;






    // handle extent change
    const handleExtentChange = useCallback((e) => {
        const newExtent = e.target.value
        setSelectedExtent(newExtent)
    }, [setSelectedExtent])

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

        fetch(JSON_PATH)
            .then((res) => res.json())
            .then((json) => {
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
                        invisible: true,
                    },
                ];

                setData(transformed);
            })
            .catch((err) => {
                console.error('Failed to fetch JSON_PATH data:', err);
                setData([]); // fallback empty
            });
    }, [selectedVariable, selectedMonth, selectedMetric, selectedExtent]);



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
                {region === 'tropics' ? (

                    <Filter
                        sx={{
                            pt: 2,
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



                    />
                ) : (null)}

                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="40%"
                        innerRadius="30%"
                        outerRadius="90%"
                        barSize={20}
                        data={data}
                    >
                        <RadialBar
                            minAngle={15}
                            background={{ fill: theme.colors.secondary }}
                            clockWise
                            dataKey='value'
                            label={{ position: 'insideStart', fill: theme.colors.background }}
                        />
                        <Legend
                            iconSize={3}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                                paddingTop: 5,

                            }}

                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{
                mt: [0, 1, 2, 3],
                pt: 2
            }}>
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
                    setValues={(newMetric) => {
                        // highlight the selected metric
                        setMetrics(newMetric)
                        // Call handleMetricChange when the filter changes
                        const selectedMetric = Object.keys(newMetric).find(key => newMetric[key]);
                        if (selectedMetric) {
                            handleMetricChange({ target: { value: selectedMetric } })
                        }
                    }}
                    // setValues={setMetrics}
                    multiSelect={false}
                // labels={{ q: 'Specific humidity' }}
                />
            </Box>
            <Row sx={{
                mt: [0, 1, 2, 3],
                pb: 30
            }}>
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