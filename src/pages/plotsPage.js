import { Box, Flex, Divider, Text } from 'theme-ui'
import Header from '../components/header'
import Menu from '../components/menu'
import TooltipWrapper from '../components/tooltip-wrapper'
import { useState } from 'react'
import { Row, Column, Button, Scrollbar, Dimmer } from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import { Filter } from '@carbonplan/components'
import { usePlotsContext } from '../components_plotsPage/PlotsContext'
import Metadata from '../components_plotsPage/metadata'
import LeadTimesPerformance from '../components_plotsPage/lead-times-performance'
import LeadTimesMap from '../components_plotsPage/lead-times-map'
import MonthlyPerformance from '@/components_plotsPage/monthly-performance'
import VariablesPerformance from '@/components_plotsPage/variables-performance'

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






const PlotsPage = () => {

  //Get shared context state
  const {
    Column1Region, setColumn1Region,
    Column2Region, setColumn2Region

  } = usePlotsContext()

  // for the UI button of the region filter for column 1 and 2 (left and right) - highlights the selected region
  const [c1regions, setc1Region] = useState({ global: true, tropics: false, temperate: false, polar: false, africa: false })
  const [c2regions, setc2Region] = useState({ global: false, tropics: true, temperate: false, polar: false, africa: false })

  // for the UI buttons of the plots filters for column 1 and 2 (left and right) - highlights the selected plot
  const [c1plots, setc1Plots] = useState({ LeadTimesPerformance: false, MonthlyPerformance: true })
  const [c2plots, setc2Plots] = useState({ LeadTimesPerformance: true, MonthlyPerformance: false })

  // actually keeps track of which plot is selected
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



              {/* Title and Intro - Forecast Performance Analysis Explainer */}
              <Column start={[1, 2]} width={[7]}>
                <Box>
                  <Box as='h1' variant='styles.h1' sx={{ mt: [5, 7, 7, 8] }}>
                    {'Forecast Performance Analysis'}
                  </Box>
                  <Box sx={{ mb: [-7], mt: [0, 0, 5, 6], fontSize: [3], letterSpacing: 'faux', fontFamily: 'faux' }}>

                    Can AI outperform traditional physics-based models in forecasting complex atmospheric variables? This web-tool allows for a performance comparison of three weather forecast models:
                    Google Deepmind&apos;s GraphCast (AI-based), ECMWF Integrated Forecasting System (IFS) (physics-based), and ECMWF AIFS (AI-based).

                    The comparison is based on verification results between each forecasting model against the ERA5 reanalysis dataset.
                    Verification metrics include: RMSE (root mean square error), MAE (mean absolute error), MBE (mean bias error), and R (correlation coefficient).

                    The evaluation covers the first 10 days of each month in 2024, with a focus on the performance of the forecast models across the lead times (10 days in 6 hour increments).
                    The following weather variables have been assessed for their accuracy across the selected regions and lead times:
                    <ul sx={{ pl: 7, mt: 0 }}>
                      <li>
                        2-meter temperature{'   '}
                        <Text as="span" sx={sx.label}>
                          T2M
                        </Text>
                      </li>
                      <li>
                        Mean sea level pressure {'   '}
                        <Text as="span" sx={sx.label}>
                          MSL
                        </Text>
                      </li>
                      <li>
                        10-meter u-component of wind {'   '}
                        <Text as="span" sx={sx.label}>
                          U10
                        </Text>
                      </li>
                      <li>
                        10-meter v-component of wind {'   '}
                        <Text as="span" sx={sx.label}>
                          V10
                        </Text>
                      </li>
                      <li>Specific humidity at 1000 hPa pressure{'   '}
                        <Text as="span" sx={sx.label}>
                          Q
                        </Text>
                      </li>
                    </ul>

                    The main objective of this comparative analysis is to evaluate whether the forecasting models perform differently in different geographic regions.
                    Four geographic regions are examined:
                    <ul sx={{ pl: 7, mt: 0 }}>
                      <li>
                        Global
                      </li>
                      <li>
                        Tropics{' '}
                        <Text as="span" sx={sx.label}>
                          23.5°S – 23.5°N
                        </Text>
                      </li>
                      <li>
                        Subtropics{' '}
                        <Text as="span" sx={sx.label}>
                          23.5° – 35° N/S
                        </Text>
                      </li>
                      <li>
                        Northern Temperate{' '}
                        <Text as="span" sx={sx.label}>
                          35°N – 60°N
                        </Text>
                      </li>
                      <li>
                        Southern Temperate{' '}
                        <Text as="span" sx={sx.label}>
                          35°S – 60°S
                        </Text>
                      </li>
                      <li>
                        Polar{' '}
                        <Text as="span" sx={sx.label}>
                          &gt;60°N and &gt;60°S
                        </Text>
                      </li>
                      <li>
                        Africa{' '}
                        <Text as="span" sx={sx.label}>
                          37°N – 35°S, 17°W – 51°E
                        </Text>
                      </li>
                    </ul>


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
                        pt: [0, 0, '42px', '55px'],
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
                        pt: [0, 0, '42px', '55px'],
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
                      • Compare weather forecasting accuracies of ML and NWP models in different climate zones



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


              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>

                <Divider />
                <Box
                  sx={{
                    pt: [2],

                  }}>
                  {/* Geographic region filter  */}
                  <Filter
                    sx={{
                      button: { fontSize: 2, color: '#FF800D' }
                    }}
                    values={c1regions}
                    setValues={(newRegion) => {
                      setc1Region(newRegion)
                      const selected = Object.keys(newRegion).find(key => newRegion[key])
                      if (selected) setColumn1Region(selected)
                    }}
                    multiSelect={false}
                  />
                </Box>
              </Box>

              <Row>
                <Column start={[1, 1]} width={[13]}>
                  {/* Spatial Lead Times Performance -> Map */}
                  <LeadTimesMap
                    region={Column1Region}
                  />
                </Column>
              </Row>

              <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                {/* Lead Times / Monthly / Variable Performance Graphs*/}
                <Row>
                  <Column start={[1, 1]} width={[13]}>


                    < Box sx={{
                      pt: [2],
                      pb: [2],

                    }
                    }>
                      <TooltipWrapper
                        tooltip='Chose between the lead times performance of the models at the different forecast lead times or 
                        the monthly performance of the models averaged over all lead times for each month of the year 2024.'
                      >

                        {/* Show filters to selecte either Lead Times Performance or Monthly/Variable Performance  */}
                        <Filter
                          sx={{

                            button: {
                              mr: 5,
                              fontSize: 2, fontFamily: 'heading', color: '#45DFB1', letterSpacing: 'smallcaps'
                            },

                          }}
                          values={c1plots}
                          setValues={(newPlot) => {
                            setc1Plots(newPlot)
                            const selected = Object.keys(newPlot).find(key => newPlot[key])
                            if (selected) setSelectedc1Plot(selected)
                          }}
                          multiSelect={false}
                          labels={{ LeadTimesPerformance: 'Lead Times Performance', MonthlyPerformance: 'Monthly Performance' }}
                        />


                      </TooltipWrapper >
                    </Box >


                    {selectedc1Plot === 'LeadTimesPerformance' && (
                      // Show Lead Times Performance Graph if selected
                      <LeadTimesPerformance region={Column1Region} />
                    )}
                  </Column>
                </Row>

                {selectedc1Plot === 'MonthlyPerformance' && (
                  // Show Monthly and Variable Performance Graph if selected
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
                      button: { fontSize: 2, color: '#FF800D' }
                    }}
                    values={c2regions}
                    setValues={(newRegion) => {
                      setc2Region(newRegion)
                      const selected = Object.keys(newRegion).find(key => newRegion[key])
                      if (selected) setColumn2Region(selected)
                    }}
                    multiSelect={false}
                  />
                </Box>
              </Box>

              {/* Lead Times Spatial Performance */}

              <Row>
                <Column start={[1, 1]} width={[13]}>

                  <LeadTimesMap
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
                        tooltip='Chose between the lead times performance of the models at the different forecast lead times or 
                        the monthly performance of the models averaged over all lead times for each month of the year 2024.'
                      >


                        <Filter
                          sx={{

                            button: {
                              mr: 5,
                              fontSize: 2, fontFamily: 'heading', color: '#45DFB1', letterSpacing: 'smallcaps'
                            },

                          }}
                          values={c2plots}
                          setValues={(newPlot) => {
                            setc2Plots(newPlot)
                            const selected = Object.keys(newPlot).find(key => newPlot[key])
                            if (selected) setSelectedc2Plot(selected)
                          }}
                          multiSelect={false}
                          labels={{ LeadTimesPerformance: 'Lead Times Performance', MonthlyPerformance: 'Monthly Performance' }}
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



export default PlotsPage





