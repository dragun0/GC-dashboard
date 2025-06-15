import { Box, Flex, Divider } from 'theme-ui'
import Header from '../components/header'
import Menu from '../components/menu'
import TooltipWrapper from '../components/tooltip-wrapper'
import { useState } from 'react'
import { Row, Column, Button, Scrollbar, Dimmer } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { Filter, Select } from '@carbonplan/components'
import { usePlotsContext } from '../components_plotsPage/PlotsContext'
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

  //Get shared context state
  const {
    Column1Region, setColumn1Region,
    Column2Region, setColumn2Region

  } = usePlotsContext()

  // for the UI button of the region filter for column 1 and 2 (left and right)
  const [c1regions, setc1Region] = useState({ global: true, tropics: false, temperate: false, polar: false, africa: false })
  const [c2regions, setc2Region] = useState({ global: false, tropics: true, temperate: false, polar: false, africa: false })

  // for the UI buttons of the plots filters for column 1 and 2 (left and right)
  const [c1plots, setc1Plots] = useState({ LeadTimesPerformance: false, MonthlyPerformance: true })
  const [c2plots, setc2Plots] = useState({ LeadTimesPerformance: true, MonthlyPerformance: false })

  // keeps track of which plot is selected
  const [selectedc1Plot, setSelectedc1Plot] = useState('MonthlyPerformance')
  const [selectedc2Plot, setSelectedc2Plot] = useState('LeadTimesPerformance')

  const [showMenu, setShowMenu] = useState(false)

  const back = '/'

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

          <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
            <Row sx={{ mb: [0] }}>
              <Box sx={{ display: ['initial', 'initial', 'initial', 'initial'] }}>
                <Column
                  start={[1, 1]}
                  width={[1]}
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
                    size='sm'
                    prefix={<Left />}
                    sx={{ ml: ['-2px', '-2px', '-2px', '-2px'] }}
                  >
                    Back
                  </Button>
                </Column>
              </Box>



              {/* Title - Forecast Performance Analysis Explainer */}
              <Column start={[1, 2]} width={[7]}>
                <Box>
                  <Box as='h1' variant='styles.h1' sx={{ mt: [5, 7, 7, 8] }}>
                    {'Forecast Performance Analysis Explainer'}
                  </Box>
                  <Box sx={{ mb: [0], mt: [0, 0, 5, 6], fontSize: [3], letterSpacing: 'faux', fontFamily: 'faux' }}>

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

                    The main objective of this comparative analysis is to evaluate whether the forecasting models perform differently in different geographic regions.
                    Four geographic regions are examined: Global, Tropics + Subtropics, Temperate Zones, and Africa.


                  </Box>


                </Box>
              </Column>

              {/* Qicklook Box */}
              <Column start={[1, 9]} width={[0]}>
                <Box
                  sx={{
                    display: ['none', 'none', 'initial'],
                    fontSize: [3],
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
                    fontSize: [3],
                  }}
                >
                  <Box sx={{ mt: [5, 6, 7, 8] }}>
                    <Box
                      sx={{
                        fontFamily: 'faux',
                        letterSpacing: 'smallcaps',
                        mb: [1],
                        pt: [0, 0, '42px', '55px'],  //  pt: tool ? [0, 0, '42px', '55px'] : [0, 0, '42px', '23px'],
                      }}
                    >
                      QUICK LOOK
                    </Box>
                    <Box
                      sx={{ color: 'blue', fontFamily: 'mono', fontSize: [2] }}
                    >
                      Forecast Models Compared:<br />
                      • <b>GraphCast</b> (ML-model)<br />
                      • <strong>ECMWF IFS</strong> (NWP-model)<br />
                      • <strong>ECMWF AIFS</strong> (ML-model)<br /><br />
                      Verification Dataset:<br />
                      • <strong> ERA5 Reanalysis</strong> <br /><br />
                      Key Geographic Regions:<br />
                      • <strong>Global</strong> <br />
                      • <strong>Tropics + Subtropics</strong> <br />
                      • <strong>Temperate Zones</strong> <br />
                      • <strong>Polar + Subpolar</strong> <br />
                      • <strong>Africa</strong> <br /><br />
                      Metrics Evaluated:<br />
                      • <strong>RMSE</strong>  <br />
                      • <strong>MAE</strong> <br />
                      • <strong>MBE</strong> <br />
                      • <strong>Correlation Coefficient (R)</strong>  <br /> <br />
                      Purpose:<br />
                      • Explore weather forecast accuracies of ML and NwP models in different climate zones



                    </Box>
                  </Box>
                </Box>
              </Column>

            </Row>
          </Box>



          <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
            <Row>
              <Column start={[1, 2]} width={[10]}>


                <Box sx={{ mb: [0], mt: [0, 0, 5, 6] }}>
                  <RegionComparison />

                </Box>
              </Column>
            </Row>
          </Box>

          {/* Comparison - Column 1 */}

          <Row >
            <Column start={[1, 2]} width={[5]}>

              {/* Geographic region filter  */}
              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>

                <Divider />
                <Box
                  sx={{
                    pt: [2],

                  }}>


                  <Filter
                    sx={{
                      button: { fontSize: 2, color: '#FF800D' }// py: 2, px: 3 }, // Increase button size // color: '#45DFB1'
                      // label: { fontSize: 3 },                // Increase label size
                      // You can also target other elements if needed
                    }}
                    values={c1regions}
                    setValues={(newRegion) => {
                      setc1Region(newRegion)
                      const selected = Object.keys(newRegion).find(key => newRegion[key])
                      if (selected) setColumn1Region(selected)
                    }}
                    multiSelect={false}
                  //  size='xl'
                  // labels={{ q: 'Specific humidity' }}
                  />
                </Box>
              </Box>

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  <LeadTimesMap
                    // LAT_MIN={-90}
                    // LAT_MAX={90}
                    region={Column1Region}
                  />
                </Column>
              </Row>

              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                {/* Lead Times Performance / Monthly / Variable Performance */}
                <Row>
                  <Column start={[1, 1]} width={[13]}>

                    {/* Lead Times Performance or Monthly/Variable Performance Filter */}
                    < Box sx={{
                      pt: [2],
                      pb: [2],

                    }
                    }>
                      <TooltipWrapper
                        tooltip=' Compares the performance of the forecast models at the different forecast lead times
                     of the selected month, averaged over all spatial points in the region.'
                      >


                        <Filter
                          sx={{

                            button: {
                              mr: 5,
                              fontSize: 2, fontFamily: 'heading', color: '#45DFB1', letterSpacing: 'smallcaps'
                            },// py: 2, px: 3 }, // Increase button size // color: '#45DFB1'

                            // label: { fontSize: 3 },                // Increase label size

                          }}
                          values={c1plots}
                          setValues={(newPlot) => {
                            setc1Plots(newPlot)
                            const selected = Object.keys(newPlot).find(key => newPlot[key])
                            if (selected) setSelectedc1Plot(selected)
                          }}
                          multiSelect={false}
                          labels={{ LeadTimesPerformance: 'Lead Times Performance', MonthlyPerformance: 'Monthly Performance' }}
                        //  size='xl'
                        // labels={{ q: 'Specific humidity' }}
                        />


                      </TooltipWrapper >
                    </Box >


                    {selectedc1Plot === 'LeadTimesPerformance' && (
                      <LeadTimesPerformance region={Column1Region} />
                    )}
                  </Column>
                </Row>

                {selectedc1Plot === 'MonthlyPerformance' && (
                  // Monthly Performance
                  <Row>
                    <Column start={[1, 1]} width={[7, 7]}>
                      <MonthlyPerformance
                        region={Column1Region} />
                    </Column>


                    <Column start={[1, 8]} width={[5, 5]}>
                      <VariablesPerformance
                        region={Column1Region} />
                    </Column>
                  </Row>
                )}

              </Box>
            </Column>





            {/* Comparison - Column 2 */}
            <Column start={[1, 7]} width={[5]}>
              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                {/* Geographic region filters */}
                <Divider />
                <Box
                  sx={{
                    pt: [2],


                  }}>


                  <Filter
                    sx={{
                      button: { fontSize: 2, color: '#FF800D' }// py: 2, px: 3 }, // Increase button size // color: '#45DFB1'
                      // label: { fontSize: 3 },                // Increase label size
                      // You can also target other elements if needed
                    }}
                    values={c2regions}
                    setValues={(newRegion) => {
                      setc2Region(newRegion)
                      const selected = Object.keys(newRegion).find(key => newRegion[key])
                      if (selected) setColumn2Region(selected)
                    }}
                    multiSelect={false}
                  //  size='xl'
                  // labels={{ q: 'Specific humidity' }}
                  />
                </Box>
              </Box>

              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>

                  <LeadTimesMap
                    // LAT_MIN={-90}
                    // LAT_MAX={90}
                    region={Column2Region}
                  />
                </Column>
              </Row>


              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>

                <Row>
                  <Column start={[1, 1]} width={[13]}>

                    {/* Lead Times Performance or Monthly/Variable Performance Filter */}
                    < Box sx={{
                      pt: [2],
                      pb: [2],

                    }
                    }>
                      <TooltipWrapper
                        tooltip=' Compares the performance of the forecast models at the different forecast lead times
                     of the selected month, averaged over all spatial points in the region.'
                      >


                        <Filter
                          sx={{

                            button: {
                              mr: 5,
                              fontSize: 2, fontFamily: 'heading', color: '#45DFB1', letterSpacing: 'smallcaps'
                            },// py: 2, px: 3 }, // Increase button size // color: '#45DFB1'

                            // label: { fontSize: 3 },                // Increase label size

                          }}
                          values={c2plots}
                          setValues={(newPlot) => {
                            setc2Plots(newPlot)
                            const selected = Object.keys(newPlot).find(key => newPlot[key])
                            if (selected) setSelectedc2Plot(selected)
                          }}
                          multiSelect={false}
                          labels={{ LeadTimesPerformance: 'Lead Times Performance', MonthlyPerformance: 'Monthly Performance' }}
                        //  size='xl'
                        // labels={{ q: 'Specific humidity' }}
                        />


                      </TooltipWrapper >
                    </Box >

                    {selectedc2Plot === 'LeadTimesPerformance' && (
                      <LeadTimesPerformance region={Column2Region} />
                    )}
                  </Column>
                </Row>


                {/* Monthly Performance */}
                {selectedc2Plot === 'MonthlyPerformance' && (
                  // Monthly Performance
                  <Row>
                    <Column start={[1, 1]} width={[7, 7]}>
                      <MonthlyPerformance
                        region={Column2Region} />
                    </Column>
                    {/* Variables Performance */}

                    <Column start={[1, 8]} width={[5, 5]}>
                      <VariablesPerformance
                        region={Column2Region} />
                    </Column>
                  </Row>
                )}
              </Box >
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

// used <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
// </Box>
// to scale everything to a smaller size: now all four graphs/maps can be seen in one view even on smaller displays -> better UX
// width: '111.11%'  = 1 / 0.9 x 100


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




