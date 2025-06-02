import { Box, Flex, Divider } from 'theme-ui'
import Header from '../components/header'
import Menu from '../components/menu'
import TooltipWrapper from '../components/tooltip-wrapper'
import { useState } from 'react'
import { Row, Column, Button, Scrollbar, Dimmer } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { Filter, Select } from '@carbonplan/components'
import Metadata from '../components_plotsPage/metadata'
import LeadTimesPerformance from '../components_plotsPage/lead-times-performance'
import LeadTimesMap from '../components_plotsPage/lead-times-map'
import MonthlyPerformance from '@/components_plotsPage/monthly-performance'
import VariablesPerformance from '@/components_plotsPage/variables-performance'
import MonthlyMap from '@/components_plotsPage/monthly-map'
import RegionOverview from '@/components_plotsPage/region-overview-plot'
import RegionComparison from '@/components_plotsPage/region-comparison'


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






const plotsPage = () => {

  const [showMenu, setShowMenu] = useState(false)

  const back = '/'

  const [variables, setVariables] = useState({ t2m: true, msl: false, u10: false, v10: false, q: false })
  const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false, R: false })

  const month_options = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'Annual'
  ]

  return (

    <>
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Menu visible={showMenu} />
      <Scrollbar />

      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          pt: '20px', // header height
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

            {/* Title - Forecast Performance Analysis Explainer */}
            <Column start={[1, 2]} width={[7]}>
              <Box sx={{}}>
                <Box as='h1' variant='styles.h1' sx={{ mt: [5, 7, 7, 8] }}>
                  {'Forecast Performance Analysis Explainer'}
                </Box>
                <Box sx={{ mb: [0, 0, 4], mt: [0, 0, 5, 6] }}>
                  <Box variant='styles.p'>
                    Can AI outperform traditional physics-based models in forecasting complex atmospheric variables? This web-tool allows for a performance comparison of three weather forecast models:
                    Google Deepmind's GraphCast (AI-based), ECMWF Integrated Forecasting System (IFS) (physics-based), and ECMWF AIFS (AI-based).

                    The comparison is based on verification results between each forecasting model against the ERA5 reanalysis dataset, which combines on-ground measurements with satellite observations.
                    Verification metrics include: RMSE (root mean square error), MAE (mean absolute error), MBE (mean bias error), and R (correlation coefficient).
                    The units of the metrics are as follows: RMSE, MAE and MBE are expressed in °C (Degrees Celsius) for temperature,
                    hPa (hectopascal) for pressure, m/s (meters per second) for wind speed, and g/kg (grams per kilogram) for specific humidity. R is unitless.

                    The evaluation covers the first 10 days of each month in 2024, with a focus on the performance of the forecast models across the lead times (10 days in 6 hour increments).
                    Since the ECMWF AIFS model has only been operational since March 2024, data for this model is only available from March onwards.
                    The following weather variables have been assessed for their accuracy across the selected regions and lead times:
                    <ul>
                      <li>2-meter temperature (t2m)</li>
                      <li>Mean sea level pressure (msl)</li>
                      <li>10-meter u-component of wind (u10) </li>
                      <li>10-meter v-component of wind (v10)</li>
                      <li>Specific humidity (q) at 1000 hPa pressure (closest to earth's surface)</li>
                    </ul>

                    The main objective of this comparative analysis is to evaluate wether the forecasting models perform differently in different geographic regions.
                    Four geographic regions are examined: Global, Tropics + Subtropics, Temperate Zones, and Africa.

                  </Box>
                </Box>

                <Box sx={{ mb: [0, 0, 4], mt: [0, 0, 5, 6] }}>
                  <RegionComparison />

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
                    Forecast Models Compared:<br />
                    • <b>GraphCast</b> (AI-based, deterministic)<br />
                    • <strong>ECMWF IFS</strong> (physics-based, operational standard, deterministic)<br />
                    • <strong>ECMWF AIFS</strong> (AI-based, deterministic)<br /><br />
                    Verification Dataset:<br />
                    • <strong> ERA5 Reanalysis</strong> <br /><br />
                    Key Geographic Regions:<br />
                    • <strong>Global</strong> <br />
                    • <strong>Tropics + Subtropics</strong> <br />
                    • <strong>Temperate Zones</strong> <br />
                    • <strong>Africa</strong> <br /><br />
                    Metrics Evaluated:<br />
                    • <strong>RMSE</strong> (Root Mean Square Error) <br />
                    • <strong>MAE</strong> (Mean Absolute Error) <br />
                    • <strong>MBE</strong> (Mean Bias Error) <br />
                    • <strong>Correlation Coefficient</strong> (R) <br /> <br />
                    Purpose:<br />
                    • Explore whether AI can outperform traditional models in complex regions.
                  </Box>
                </Box>
              </Box>
            </Column>
          </Row>



          {/* Title - Global Extent  */}
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
                        display: 'flex',
                        alignItems: 'baseline', // aligns text on same baseline
                        gap: [2, 3, 4],
                        flexWrap: 'wrap',       // allows wrapping on small screens
                      }}
                    >
                      <Box
                        sx={{
                          ...sx.heading,
                          //   fontFamily: 'faux',
                          textTransform: 'uppercase',
                          letterSpacing: 'smallcaps',
                          mb: 0,
                          display: 'inline',
                        }}
                      >
                        Global Extent
                      </Box>

                      <Box
                        sx={{
                          ...sx.subheading,
                          display: 'inline',
                        }}
                      >
                        90°N – 90°S | 180°W – 180°E
                      </Box>
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
              </Box>



              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesMap
                    LAT_MIN={-90}
                    LAT_MAX={90}
                  />
                </Column>
              </Row>

              {/* Lead Times Performance */}
              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesPerformance />
                </Column>
              </Row>


              {/* Monthly Performance */}
              <Row>
                <Column start={[1, 1]} width={[7, 7]}>
                  <MonthlyPerformance />
                </Column>

                {/* Variables Performance */}
                <Column start={[1, 8]} width={[5, 5]}>
                  <VariablesPerformance />
                </Column>
              </Row>






              {/* Monthly Spatial Performance - Mini map plot

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <MonthlyMap />
                </Column>
              </Row>

               */}


            </Column>





            {/* Region Overview */}
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
                    tooltip=' Evaluation metric averaged over all spatial points in the region,
                    and all lead times within the selected month.'
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        //   fontFamily: 'faux',
                        textTransform: 'uppercase',
                        letterSpacing: 'smallcaps',
                        mb: 0,
                        display: 'inline',
                      }}
                    >
                      Region Overview
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
                <RegionOverview />


              </Box>
            </Column>
          </Row>




          {/* Title - Tropics  */}
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
                        display: 'flex',
                        alignItems: 'baseline', // aligns text on same baseline
                        gap: [2, 3, 4],
                        flexWrap: 'wrap',       // allows wrapping on small screens
                      }}
                    >
                      <Box
                        sx={{
                          ...sx.heading,
                          //   fontFamily: 'faux',
                          textTransform: 'uppercase',
                          letterSpacing: 'smallcaps',
                          mb: 0,
                          display: 'inline',
                        }}
                      >
                        Tropics + Subtropics
                      </Box>

                      <Box
                        sx={{
                          ...sx.subheading,
                          display: 'inline',
                        }}
                      >
                        35°N – 35°S | 180°W – 180°E

                      </Box>
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
              </Box>



              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesMap
                    LAT_MIN={-35}
                    LAT_MAX={35} />
                </Column>
              </Row>

              {/* Lead Times Performance */}
              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesPerformance />
                </Column>
              </Row>


              {/* Monthly Performance */}
              <Row>
                <Column start={[1, 1]} width={[7, 7]}>
                  <MonthlyPerformance />
                </Column>

                {/* Variables Performance */}
                <Column start={[1, 8]} width={[5, 5]}>
                  <VariablesPerformance />
                </Column>
              </Row>






              {/* Monthly Spatial Performance - Mini map plot 

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <MonthlyMap />
                </Column>
              </Row>
            */}

            </Column>





            {/* Region Overview */}
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
                    tooltip=' Evaluation metric averaged over all spatial points in the region,
                    and all lead times within the selected month.'
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        //   fontFamily: 'faux',
                        textTransform: 'uppercase',
                        letterSpacing: 'smallcaps',
                        mb: 0,
                        display: 'inline',
                      }}
                    >
                      Region Overview
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
                <RegionOverview />


              </Box>
            </Column>
          </Row>



          {/* Title - Temperate Zones  */}
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
                        display: 'flex',
                        alignItems: 'baseline', // aligns text on same baseline
                        gap: [2, 3, 4],
                        flexWrap: 'wrap',       // allows wrapping on small screens
                      }}
                    >
                      <Box
                        sx={{
                          ...sx.heading,
                          //   fontFamily: 'faux',
                          textTransform: 'uppercase',
                          letterSpacing: 'smallcaps',
                          mb: 0,
                          display: 'inline',
                        }}
                      >
                        Temperate Zones
                      </Box>

                      <Box
                        sx={{
                          ...sx.subheading,
                          display: 'inline',
                        }}
                      >
                        35°N – 60°N & 35°S – 60°S | 180°W – 180°E

                      </Box>
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
              </Box>



              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesMap
                    LAT_MIN={-60}
                    LAT_MAX={60} />
                </Column>
              </Row>

              {/* Lead Times Performance */}
              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesPerformance />
                </Column>
              </Row>


              {/* Monthly Performance */}
              <Row>
                <Column start={[1, 1]} width={[7, 7]}>
                  <MonthlyPerformance />
                </Column>

                {/* Variables Performance */}
                <Column start={[1, 8]} width={[5, 5]}>
                  <VariablesPerformance />
                </Column>
              </Row>






              {/* Monthly Spatial Performance - Mini map plot 

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <MonthlyMap />
                </Column>
              </Row>
            */}

            </Column>





            {/* Region Overview */}
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
                    tooltip=' Evaluation metric averaged over all spatial points in the region,
                    and all lead times within the selected month.'
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        //   fontFamily: 'faux',
                        textTransform: 'uppercase',
                        letterSpacing: 'smallcaps',
                        mb: 0,
                        display: 'inline',
                      }}
                    >
                      Region Overview
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
                <RegionOverview />


              </Box>
            </Column>
          </Row>




          {/* Title - Africa  */}
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
                        display: 'flex',
                        alignItems: 'baseline', // aligns text on same baseline
                        gap: [2, 3, 4],
                        flexWrap: 'wrap',       // allows wrapping on small screens
                      }}
                    >
                      <Box
                        sx={{
                          ...sx.heading,
                          //   fontFamily: 'faux',
                          textTransform: 'uppercase',
                          letterSpacing: 'smallcaps',
                          mb: 0,
                          display: 'inline',
                        }}
                      >
                        Africa
                      </Box>

                      <Box
                        sx={{
                          ...sx.subheading,
                          display: 'inline',
                        }}
                      >
                        35°N – 35°S | 180°W – 180°E

                      </Box>
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
              </Box>



              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesMap
                    LAT_MIN={-90}
                    LAT_MAX={90}
                    region='africa' />
                </Column>
              </Row>

              {/* Lead Times Performance */}
              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesPerformance />
                </Column>
              </Row>


              {/* Monthly Performance */}
              <Row>
                <Column start={[1, 1]} width={[7, 7]}>
                  <MonthlyPerformance />
                </Column>

                {/* Variables Performance */}
                <Column start={[1, 8]} width={[5, 5]}>
                  <VariablesPerformance />
                </Column>
              </Row>






              {/* Monthly Spatial Performance - Mini map plot 

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <MonthlyMap />
                </Column>
              </Row>
            */}

            </Column>





            {/* Region Overview */}
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
                    tooltip=' Evaluation metric averaged over all spatial points in the region,
                    and all lead times within the selected month.'
                  >
                    <Box
                      sx={{
                        ...sx.heading,
                        //   fontFamily: 'faux',
                        textTransform: 'uppercase',
                        letterSpacing: 'smallcaps',
                        mb: 0,
                        display: 'inline',
                      }}
                    >
                      Region Overview
                    </Box>
                  </TooltipWrapper>
                </Box>
                <Divider />
                <RegionOverview />


              </Box>
            </Column>
          </Row>




        </Box >





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



// Tropics: 23.5°N – 23.5°S | 180°W – 180°E

// Extra-Tropics: >23.5°N & <23.5°S | 180°W – 180°E

// Africa: 37°N – 35°S | 17°W – 51°E


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