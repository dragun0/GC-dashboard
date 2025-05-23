import {
  AxisLabel,
  Axis,
  //  Bar,
  Chart,
  Grid,
  //  Line,
  Circle,
  Plot,
  TickLabels,
  Ticks,
  StackedBar,
} from '@carbonplan/charts'
import { Bar as CPBar } from '@carbonplan/charts'
import { Box, Flex, Divider, useThemeUI } from 'theme-ui'
import Header from '../components/header'
import Menu from '../components/menu'
import TooltipWrapper from '../components/tooltip-wrapper'
import { useState } from 'react'
import {
  Row,
  Column,
  Button,
  Guide,
  Scrollbar,
  Dimmer,
  Filter,
  Select,
} from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import Metadata from '../components_plotsPage/metadata'
import { Minimap, Raster, Path, Sphere, Graticule } from '@carbonplan/minimaps'
import { naturalEarth1 } from '@carbonplan/minimaps/projections'
import { useThemedColormap } from '@carbonplan/colormaps'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
} from 'recharts'
//import { Article, Tool } from '@carbonplan/layouts'
//import * as CarbonComponents from '@carbonplan/components'
//console.log(CarbonComponents)


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
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
    mb: [2],
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

// recharts timesteps series plot (mock data)
const newdata = Array.from({ length: 41 }, (_, x) => ({
  x,
  GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
  ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
  ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
}));

// months time series plot (mock data)
const MonthsData = Array.from({ length: 12 }, (_, x) => ({
  x,
  GraphCast: 10 + Math.sin(x / 4) * 5 + x * 0.2,
  ecmwfIFS: 12 + Math.cos(x / 5) * 4 + x * 0.25,
  ecmwfAIFS: 11 + Math.sin(x / 6) * 3 + x * 0.3,
}));


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


const plotsPage = () => {

  const { theme } = useThemeUI()

  const [showMenu, setShowMenu] = useState(false)

  const back = '/'

  {/* for recharts */ }
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


  const BarChartData = [
    [3, 0, 20],
    [2, 0, 10],
    [1, 0, 5], // y = 2, x = from 0 to 2 (bar of width 2)

  ]
  // For Carbonplans stacked bar chart
  const StackedBarChartData = [
    [0, 0, 30, 60, 80],   // Bar at x=0 with 2 stacked segments: [0→30], [30→60]
    [1, 0, 20, 30, 50],   // Bar at x=1 with 2 segments: [0→20], [20→50]
    [2, 0, 40, 50, 70],  // Bar at x=2 with 2 segments: [0→40], [40→100]
    [3, 0, 10, 20, 40],
    [4, 0, 50, 60, 75],
  ]

  const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })

  const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

  const month_options = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'All months'
  ]

  const colormap = useThemedColormap('fire')

  return (

    <>
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Menu visible={showMenu} />
      <Scrollbar />

      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          pt: '20px', // or whatever the header height is
        }}
      >
        <Box
          sx={{
            width: '100%',
            flex: '1 1 auto',
            mb: 6
          }}
        >


          <Row sx={{ mb: [3, 4, 5, 6] }}>
            <Box sx={{ display: ['initial', 'initial', 'initial', 'initial'] }}>
              <Column
                start={[1, 1]}
                width={[2]}
                dr={1}
                sx={{ mb: [-2, -4, 0, 0], mt: [3, 4, '109px', '154px'], ml: [3, 3, 4, 4] }}
              >
                <Button
                  onClick={() => {
                    if (window.history.state?.idx) {
                      window.history.back()
                    } else {
                      window.location.href = back
                    }
                  }}
                  inverted
                  size='xs'
                  prefix={<Left />}
                  sx={{ ml: ['-2px', '-2px', '-2px', '-2px'] }}
                >
                  Back
                </Button>
              </Column>
            </Box>
            <Column start={[1, 2]} width={[7]}>
              <Box sx={{}}>
                <Box as='h1' variant='styles.h1' sx={{ mt: [5, 7, 7, 8] }}>
                  {'Forecast Performance Analysis Explainer'}
                </Box>
                <Box sx={{ mb: [0, 0, 4], mt: [0, 0, 5, 6] }}>
                  <Box as='p' variant='styles.p'>
                    Nulla gravida enim nec tellus semper dictum. Integer mi quam, commodo sit amet pretium at, consectetur eu ipsum. Phasellus eu tristique metus, sit amet elementum tellus. Nulla at cursus ipsum, eu varius turpis. Sed neque urna, egestas quis varius et, ullamcorper eget nulla. Donec eget sagittis justo. Morbi ac mauris sem.

                    Duis vel nisl eget ex accumsan scelerisque. Morbi enim dolor, aliquam eget sollicitudin id, dictum sit amet quam. Aenean quis nisi congue, elementum ligula at, rhoncus ligula. Ut massa quam
                    Duis vel nisl eget ex accumsan scelerisque. Morbi enim dolor, aliquam eget sollicitudin id, dictum sit amet quam. Aenean quis nisi congue, elementum ligula at, rhoncus ligula. Ut massa quam, volutpat non mauris in, luctus condimentum turpis. Donec condimentum nulla augue, eget porta est commodo ac. Pellentesque vitae neque felis. Donec elementum, nunc eu pulvinar maximus, purus mi tristique odio, vitae tristique ligula ante eu enim. In ac nulla blandit ligula convallis rutrum. Aliquam gravida lectus non tortor suscipit, laoreet tempus magna consectetur. Proin facilisis semper nulla sit amet accumsan. Nullam metus felis, finibus sit amet ante ac, faucibus pellentesque nisi. Aliquam mattis nulla lorem, id interdum velit pretium id.
                  </Box>
                </Box>
              </Box>
            </Column>

            {/* Qicklook Box */}
            <Column start={[1, 9]} width={[1]}>
              <Box
                sx={{
                  display: ['none', 'none', 'initial'],
                  fontSize: [2, 2, 2, 3],
                }}
              >
                <Box sx={{ mt: [5, 6, 7, 8] }}>
                  <Box
                    sx={{
                      fontFamily: 'faux',
                      letterSpacing: 'smallcaps',
                      mb: [3],
                      pt: [0, 0, '42px', '55px'],          //   pt: tool ? [0, 0, '42px', '55px'] : [0, 0, '42px', '23px'],
                      textAlign: 'right',
                    }}
                  >
                    /
                  </Box>
                </Box>
              </Box>
            </Column>


            <Column start={[1, 10]} width={[1, 2]}>
              <Box
                sx={{
                  display: ['none', 'none', 'initial'],
                  fontSize: [2, 2, 2, 3],
                }}
              >
                <Box sx={{ mt: [5, 6, 7, 8] }}>
                  <Box
                    sx={{
                      fontFamily: 'faux',
                      letterSpacing: 'smallcaps',
                      mb: [3],
                      pt: [0, 0, '42px', '55px'],  //  pt: tool ? [0, 0, '42px', '55px'] : [0, 0, '42px', '23px'],
                    }}
                  >
                    QUICK LOOK
                  </Box>
                  <Box
                    sx={{ color: 'blue', fontFamily: 'faux', letterSpacing: 'faux' }}
                  >
                    Duis vel nisl eget ex accumsan scelerisque. Morbi enim dolor, aliquam eget sollicitudin id, dictum sit amet quam. Aenean quis nisi congue, elementum ligula at, rhoncus ligula. Ut massa quam, volutpat non mauris in, luctus condimentum turpis. Donec condimentum nulla augue, eget porta est commodo ac. Pellentesque vitae neque felis.
                  </Box>
                </Box>
              </Box>
            </Column>
          </Row>



          {/* Global Region Title  */}
          <Row >
            <Column start={[1, 2]} width={[7]}>
              <Box sx={{
                position: 'sticky',
                top: '55px', // header height
                zIndex: 900,
                bg: 'background',

              }}>
                <Divider />
                <Box sx={{
                  pt: [1, 2, 3, 4],
                  pb: [1, 2, 3, 4],
                }}>
                  <TooltipWrapper
                    tooltip=' All spatially averaged values are averaged across the globe '
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        fontFamily: 'faux',
                        mb: 0,
                        // letterSpacing: 'smallcaps',

                        // pt: [0, 0, '42px', '55px'],  //  pt: tool ? [0, 0, '42px', '55px'] : [0, 0, '42px', '23px'],
                      }}
                    >
                      Global Extent
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
              </Box>


              <Row>
                <Column start={[1, 1]} width={[13]}>
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
                        data={newdata}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid stroke={theme.colors.secondary} strokeWidth={0.15} />
                        <XAxis dataKey="x"
                          label={{

                            value: 'Lead Time',
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
                </Column>
              </Row>


              {/* Mini map plot */}

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <Box
                    sx={{
                      pt: 30,
                      //    pb: 30,
                      //   borderRadius: 'xl',
                      height: '500px',
                      width: '100%',
                      // make map less high (i.e. decreae height)
                    }}
                  >

                    <Minimap projection={naturalEarth1}>
                      <Path
                        stroke={theme.colors.primary}
                        source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
                        feature={'land'}
                      />
                      <Graticule stroke={theme.colors.primary} />
                      <Sphere fill={theme.colors.background} />
                      <Raster
                        clim={[0, 50000000]}
                        mode='lut'
                        nullValue={9.969209968386869e36}
                        source={
                          'https://carbonplan-climatetrace.s3.us-west-2.amazonaws.com/v0.4/blog/total_emissions.zarr'
                        }
                        variable={'emissions'}
                        colormap={colormap}

                      />
                    </Minimap>
                  </Box>
                </Column>
              </Row>


              <Row>
                <Column start={[1, 1]} width={[7, 7]}>
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
                </Column>

                <Column start={[1, 8]} width={[5, 5]}>
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
                        data={StackedBarData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid stroke={theme.colors.secondary} vertical={false} strokeWidth={0.15} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="GraphCast" stackId="a" fill="#8884d8" />
                        <Bar dataKey="ecmwfAIFS" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="ecmwfIFS" stackId="a" fill="#FF746C" />
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
                </Column>
              </Row>


              {/* Time Series of months */}
              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <Box
                    sx={{
                      p: 3,
                      pr: 0,
                      pt: 9,


                      height: '450px',
                      width: '100%',
                    }}
                  >


                  </Box>
                </Column>
              </Row>


            </Column>



            {/* Region Overview Ranking */}
            <Column start={[1, 10]} width={[1, 2]}>
              <Box sx={{
                position: 'sticky',
                top: '55px', // header height
                zIndex: 900,
                bg: 'background',

              }}>
                <Divider />
                <Box sx={{
                  pt: [1, 2, 3, 4],
                  pb: [1, 2, 3, 4],
                }}>
                  <TooltipWrapper
                    tooltip=' Averaged evaluation metric across all spatial points in the region,
                    and all time steps (lead times) within the selected time frame. '
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        fontFamily: 'faux',
                        mb: 0,
                        // letterSpacing: 'smallcaps',

                        // pt: [0, 0, '42px', '55px'],  //  pt: tool ? [0, 0, '42px', '55px'] : [0, 0, '42px', '23px'],
                      }}
                    >
                      Region Overview
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />

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
              </Box>
            </Column>
          </Row>







        </Box>





        <Box
          sx={{
            display: ['none', 'none', 'initial', 'initial'],
            position: ['fixed'],
            right: [13],
            bottom: [17, 17, 15, 15],
          }}
        >
          <Dimmer />
        </Box>
        <Metadata mode={'mouse'} />

      </Flex >

    </>

  )

}



export default plotsPage


//  <Metadata mode= {'scroll'} />




/*
                  <Chart x={[0, 20]} y={[0, 3]} padding={{ left: 0, top: 30 }}>
                    <Ticks bottom />
                    <TickLabels bottom />
                    <Axis bottom />
                    <Plot>
                      <CPBar data={BarChartData}
                        color={BarChartData.map((_, i) => ['purple', 'red', 'orange',][i % 4])}
                        direction='horizontal' />
                    </Plot>
                  </Chart>
                </Box>
*/


/* CarbonPlans - Variable Stacked plot

<Chart x={[-1, 4]} y={[0, 100]} padding={{ left: 60, top: 50, right: 10 }}>
    <Ticks left  />
    <TickLabels left  />
    <Axis left bottom />
    <AxisLabel left>Evaluation metric</AxisLabel>
  
    <Plot>
    <StackedBar data={StackedBarChartData} color={'purple'} />
    </Plot>
</Chart>
*/