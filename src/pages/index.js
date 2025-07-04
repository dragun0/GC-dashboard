import { useState, useMemo } from 'react'
import { Box, Flex, useThemeUI, Divider, Spinner } from 'theme-ui'
import { Dimmer, Group } from '@carbonplan/components'
import { Map, Raster, Fill, Line, RegionPicker } from '@carbonplan/maps'
import { useThemedColormap } from '@carbonplan/colormaps'
import { SidebarAttachment } from '@carbonplan/layouts'
import { useRegionContext } from '../components/region'
import DatasetControls from '../components/dataset-section'
import ControlPanel from '../components/control-panel'
import Ruler from '../components/ruler'
import Legend from '../components/legend'
import Title from '../components/title'
import DisplaySection from '../components/display-section'
import Menu from '../components/menu'
import Header from '../components/header'
import PlayButtonDateTime from '../components/play-datetime'

const bucket = 'https://carbonplan-maps.s3.us-west-2.amazonaws.com/'
const bucket_metrics = 'https://dashboard-app-zarr.s3.amazonaws.com/Pyramids/'



const Index = () => {



  //Get shared context state
  const {
    basemap,
    display,
    debug,
    opacity,
    clim,
    colormapName,
    setRegionData, showRegionPicker,
    time, setTime,
    band,
    forecastModel,
    evaluationMetric,
    year,
    month,
    colormapReverse,
  } = useRegionContext()


  const rasterSource = useMemo(() => {
    return evaluationMetric === 'AE'
      ? `${bucket_metrics}${year}${month}01_${evaluationMetric}_${forecastModel}.zarr`
      : `${bucket_metrics}Annual_${evaluationMetric}_${forecastModel}.zarr`
  }, [year, month, evaluationMetric, forecastModel])


  const cm = useThemedColormap(colormapName)
  const colormap = colormapReverse ? [...cm].reverse() : cm


  const selector = useMemo(() => {

    return {
      time: Array.from({ length: 41 }, (_, i) => i)
    }
  }, [time])




  // local UI-only states
  // for the sidebar (control panel)
  const [expanded, setExpanded] = useState(false)
  const { theme } = useThemeUI()
  const [loading, setLoading] = useState(false)

  const [showMenu, setShowMenu] = useState(false)


  const sx = {
    heading: {
      fontFamily: 'heading',
      letterSpacing: 'smallcaps',
      textTransform: 'uppercase',
      fontSize: [2, 2, 2, 3],
    },
    label: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      textTransform: 'uppercase',
      fontSize: [1, 1, 1, 2],
      mt: [3],
    },
  }

  return (
    <>
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Menu visible={showMenu} setExpanded={setExpanded} setShowMenu={setShowMenu} />

      {/* Map + Layers */}

      <SidebarAttachment
        expanded={expanded}

      >
        <Box
          sx={{
            py: [1],
            pl: [3, 4, 5, 6],
            pr: [3, 4, 5, 6],
            opacity: expanded ? 1 : 0,
            transition: ' opacity 0.25s',

          }}>
          <Box sx={{ ...sx.heading, mt: [3] }}>
            Performance Analysis
          </Box>
        </Box>

      </SidebarAttachment>

      <Box sx={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}>
        {/* Load Spinner */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: [5, 5, 6, 6],
              left: expanded ? ['38%'] : [5, 5, 6, 6],
              transition: 'left 0.3s ease',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              backgroundColor: 'transparent',
              borderRadius: 0,
              p: 0,
            }}
          >
            <Spinner size={32} />
          </Box>
        )}






        <Map zoom={1} center={[0, 50]} debug={debug}>

          {basemap.oceanMask && (
            <Box>
              <Fill
                color={theme.rawColors.background}
                source={bucket + 'basemaps/ocean'}
                variable={'ocean'}
              />

              <Line
                color={theme.rawColors.primary}
                source={bucket + 'basemaps/land'}
                variable={'land'}
              />
            </Box>
          )}

          {basemap.landMask && (
            <Box>
              <Fill
                color={theme.rawColors.background}
                source={bucket + 'basemaps/land'}
                variable={'land'}
              />

              <Line
                color={theme.rawColors.primary}
                source={bucket + 'basemaps/land'}
                variable={'land'}
              />
            </Box>


          )}


          <Line
            color={theme.rawColors.primary}
            source={bucket + 'basemaps/land'}
            variable={'land'}
          />


          <Raster
            colormap={colormap}
            clim={clim}
            display={display}
            opacity={opacity}
            mode={'dotgrid'}
            key={rasterSource}
            source={rasterSource}
            variable={'climate'}
            version='v2'
            selector={{ time, band }}
            // dimensions={['time', 'y', 'x']}
            regionOptions={{ setData: setRegionData, selector }}
            //regionOptions={{ setData: debugSetRegionData }} // Use the debug function
            //regionOptions= {{ setData: setRegionData, time: [1, 2] }}
            //regionOptions= {{ setData: setRegionData, selector: { time: [1, 2]} }}
            //regionOptions= {{ setData: setRegionData, selector:{time: 1} }}
            setLoading={(val) => setLoading(val)} // <- handles loading complete
          />
          {showRegionPicker && (
            <RegionPicker
              color={theme.colors.primary}
              backgroundColor={theme.colors.background}
              fontFamily={theme.fonts.mono}
              fontSize={'14px'}
              maxRadius={4000}
              setData

            />
          )}

          {/* Legend, Grid Controls, Dimmer - move position to the left when menu is shown */}
          <Box
            sx={{
              position: 'absolute',
              zIndex: 20,
              right: showMenu ?
                [
                  0,
                  'calc(2 * 100vw / 8 + 18px - 1px)',
                  'calc(2 * 100vw / 12 + 24px - 1px)',
                  'calc(2 * 100vw / 12 + 35px)',
                ] : [13],
              bottom: [17, 17, 15, 15],
              transition: 'right 0.3s ease',
            }}
          >
            <Flex sx={{ gap: [3], alignItems: 'flex-end' }}>
              <Legend />
              <Ruler />
              <Dimmer
                sx={{
                  display: ['none', 'none', 'initial', 'initial'],
                  color: 'primary',
                }}
              />
            </Flex>
          </Box>

          {/* Date Time Display - show when control panel is expanded*/}
          <Box
            sx={{
              position: 'absolute',
              zIndex: 40,
              left: 'calc(40vw)',
              bottom: [17, 17, 15, 15],
              transition: 'left 0.3s ease',
            }}
          >
            {expanded && (
              <PlayButtonDateTime
                time={time}
                setTime={setTime}
                max={40}
                delay={300}
                pause='max'
              />
            )
            }
          </Box>


          {/* Control Panel */}

          <ControlPanel
            expanded={expanded}
            setExpanded={setExpanded}
          >

            <Group spacing={4}>
              <Box sx={sx.description}>
                This interactive tool maps the accuracies of two machine learning models
                (GraphCast and ECMWF-AIFS) and a traditional numerical weather prediction model (ECMWF-IFS HRES).
                All models have been evaluated against ERA5 reanalysis data, and the results can be explored on this dashboard.
              </Box>

              <Divider sx={{ my: 4 }} />

              <DatasetControls />

              <Divider sx={{ my: 4 }} />

              <DisplaySection />

            </Group>

          </ControlPanel>

          {!expanded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: showMenu ? [
                  0,
                  'calc(2 * 100vw / 8 + 18px - 1px)',
                  'calc(2 * 100vw / 12 + 24px - 1px)',
                  'calc(2 * 100vw / 12 + 35px)',
                ] : 0, // same width as the menu
                transition: 'right 0.3s ease',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <Title expanded={expanded} setExpanded={setExpanded} />
            </Box>
          )}

        </Map>

      </Box>
    </>
  )
}

export default Index
