
import { Box, useThemeUI } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Filter, Column } from '@carbonplan/components'
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

/*
const MonthsData = Array.from({ length: 12 }, (_, x) => ({
    x,
    GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
    ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
    ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
}));

*/

const MonthlyPerformance = (props) => {

    const {
        region
    } = props

    // keep track of the actual extent selected (for the tropics section)
    const [selectedExtent, setSelectedExtent] = useState('tropics');

    let JSON_PATH = '';
    if (region === 'global') JSON_PATH = '/plotsPageData/Global/R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'tropics') JSON_PATH = '/plotsPageData/Tropics/Tropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'tropics' && selectedExtent == 'subtropics') JSON_PATH = '/plotsPageData/Subtropics/Subtropics_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'polar') JSON_PATH = '/plotsPageData/Polar/Polar_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'africa') JSON_PATH = '/plotsPageData/Africa/Africa_R_RMSE_MAE_MBE_monthly_allmodels.json';
    else if (region === 'temperate') JSON_PATH = '/plotsPageData/NTemperate/NTemperate_R_RMSE_MAE_MBE_monthly_allmodels.json';


    // UI states
    const { theme } = useThemeUI()

    // only necessary for highlighting the radio buttons
    const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })
    const [extent, setExtent] = useState({ tropics: true, subtropics: false })

    /*
        const [allData, setAllData] = useState({})
        // const [selectedVariable, setSelectedVariable] = useState('t2m')
        const [selectedModels, setSelectedModels] = useState(['GraphCast', 'ecmwfIFS', 'ecmwfAIFS'])
        const [chartData, setChartData] = useState([])
        const [monthlyData, setMonthlyData] = useState([])
    
        useEffect(() => {
            fetch('/plotsPageData/Global/RMSE_monthly_allmodels.json')
                .then((res) => res.json())
                .then((json) => setMonthlyData(json))
            console.log("Monthly data:", monthlyData)
        }, [])
        */

    //  for structuring the json data
    const MODELS = ['gc', 'marsai', 'marsfc'];

    const [data, setData] = useState([]);
    const [selectedVariable, setSelectedVariable] = useState('t2m');
    const [selectedMetric, setSelectedMetric] = useState('rmse')

    const VARIABLE_UNITS = {
        u10: 'm/s',
        v10: 'm/s',
        t2m: '°C',
        msl: 'hPa',
        q: 'g/kg',
    };

    // handle extent change
    const handleExtentChange = useCallback((e) => {
        const newExtent = e.target.value
        setSelectedExtent(newExtent)
    }, [setSelectedExtent])

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
                //  console.log("Filtered data:", filtered)

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
    }, [selectedVariable, selectedMetric, selectedExtent, region]);



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
                    The monthly values are computed across all spatial points and leadtimes of the month.'

                >
                    <Column>
                        {/* tropics or subtropics filter if overall region is = tropics */}
                        {region === 'tropics' && (


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
                                        //Call handleVariableChange when the filter changes
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
                </ResponsiveContainer>


            </Box>
        </>
    )
}

export default MonthlyPerformance

/*

                      <Line type="monotone" dataKey="ecmwfAIFS" strokeOpacity={opacity.ecmwfAIFS} stroke="#FF746C" />
                        <Line type="monotone" dataKey="GraphCast" strokeOpacity={opacity.GraphCast} stroke="#8884d8" />
                        <Line type="monotone" dataKey="ecmwfIFS" strokeOpacity={opacity.ecmwfIFS} stroke="#82ca9d" />


// months time series plot (mock data)
const MonthsData = Array.from({ length: 12 }, (_, x) => ({
    x,
    GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
    ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
    ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
}));
*/

/*
 useEffect(() => {
     fetch('/plotsPageData/Global/RMSE_monthly_allmodels.json')
         .then((res) => res.json())
         .then((json) => setMonthlyData(json))
     console.log("Monthly data:", monthlyData)
 }, [])
 

 useEffect(() => {
     fetch('/plotsPageData/Global/RMSE_monthly_allmodels.json')
         .then((res) => res.json())
         .then((json) => {
             // Filter out NaN t2m entries
             const filtered = json.filter((entry) => !isNaN(entry.t2m))

             // Group by month and pivot model names into keys
             const reshaped = []

             for (let i = 1; i <= 13; i++) {
                 const row = { month: i }
                 filtered.forEach((entry) => {
                     if (entry.month === i) {
                         if (entry.model === 'gc') row['GraphCast'] = entry.t2m
                         if (entry.model === 'marsfc') row['ecmwfIFS'] = entry.t2m
                         if (entry.model === 'marsai') row['ecmwfAIFS'] = entry.t2m
                     }
                 })
                 reshaped.push(row)
             }

             console.log("Reshaped data:", reshaped)
             setMonthlyData(reshaped)
         })
 }, [])
 */



/*
// Model key mapping
const modelMap = {
   'gc': 'GraphCast',
   'marsfc': 'ecmwfIFS',
   'marsai': 'ecmwfAIFS'
}

useEffect(() => {
   fetch('/plotsPageData/Global/RMSE_monthly_allmodels.json')
       .then((res) => res.json())
       .then((json) => {
           const structuredData = {}

           json.forEach((entry) => {
               const modelKey = modelMap[entry.model]
               const { month, variable, value } = entry

               console.log("Inspecting entry:", entry)
               console.log("value:", value)
               console.log("Mapped model:", modelKey)

               // Skip invalid entries and 13th month aka annual average
               if (isNaN(value) || month < 1 || month > 12) {
                   console.log("Skipping due to failed check")
                   return
               }

               if (!structuredData[variable]) {
                   structuredData[variable] = {}
               }

               if (!structuredData[variable][modelKey]) {
                   structuredData[variable][modelKey] = []
               }

               // Ensure each month is added once per model-variable
               const existing = structuredData[variable][modelKey].find((d) => d.month === month)
               if (!existing) {
                   structuredData[variable][modelKey].push({ month, value })
               }
           })
           console.log("Structured data:", structuredData)

           setAllData(structuredData)
       })
}, [])

// Update chart data based on selected variable and models
useEffect(() => {
   if (!allData[selectedVariable]) {
       console.log("No data for selected variable")
       return
   }

   const dataByMonth = {}

   // Collect data from all selected models for each month
   selectedModels.forEach((model) => {
       const modelData = allData[selectedVariable][model] || []
       modelData.forEach(({ month, value }) => {
           if (!dataByMonth[month]) dataByMonth[month] = { month }
           dataByMonth[month][model] = value
       })
   })

   // Convert to array sorted by month
   const finalData = Object.values(dataByMonth).sort((a, b) => a.month - b.month)
   console.log("Chart data:", finalData)
   console.log("Selected variable:", selectedVariable)
   console.log("Selected models:", selectedModels)
   console.log("All data:", allData)
   setChartData(finalData)

   // use effect runs if one of these dependencies changes
}, [allData, selectedVariable, selectedModels])
*/