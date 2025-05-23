import { useState, useMemo, useEffect } from 'react'
import { Box, Flex, useThemeUI, Divider, Spinner } from 'theme-ui'
import { Dimmer, Toggle, Group, Link, Meta, Button, Expander } from '@carbonplan/components'
import { Map, Raster, Fill, Line, RegionPicker } from '@carbonplan/maps'
import { useThemedColormap } from '@carbonplan/colormaps'
import { SidebarAttachment } from '@carbonplan/layouts'
import { useRegionContext } from '../components/region'
//import { openArray, HTTPStore } from 'zarr'
import DatasetControls from '../components/dataset-section'
import ControlPanel from '../components/control-panel'
import Ruler from '../components/ruler'
import Legend from '../components/legend'
import Title from '../components/title'
import TimeSeries from '../components/time-series'
//import Legend from '../components/legend'
import { Reset } from '@carbonplan/icons'
import DisplaySection from '../components/display-section'
import Menu from '../components/menu'
import Header from '../components/header'
import PlayButtonDateTime from '../components/play-datetime'
//import Menu from '../components/menu'
//import Header from '../components/header'
// also install '@carbonplan/themes'
//import { Group } from '@carbonplan/components'

const bucket = 'https://carbonplan-maps.s3.us-west-2.amazonaws.com/'
const bucket_metrics = 'https://dashboard-app-zarr.s3.amazonaws.com/Pyramids/'



const Index = () => {
  


  //Get shared context state
  const {
    display, setDisplay,
    debug, setDebug,
    opacity, setOpacity,
    clim, setClim,
    colormapName, setColormapName,
    setRegionData, showRegionPicker,
    time, setTime,
    band, setBand,
    setRegionExtent,
    forecastModel, 
    evaluationMetric,
    year,
    month,
  } = useRegionContext()

  const rasterSource = useMemo(() => {
  return `${bucket_metrics}${year}${month}01_${evaluationMetric}_${forecastModel}.zarr`
  }, [year, month, evaluationMetric, forecastModel])

  //console.log('source url:', `${bucket_metrics}${year}${month}01_${evaluationMetric}_${forecastModel}.zarr`)
  //console.log('raster source:', rasterSource)

  useEffect(() => {
  console.log('Updated raster source URL:', rasterSource)
  }, [rasterSource])

  const colormap = useThemedColormap(colormapName)

  //const selector = {time: [1, 2, 3]}

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

  //const [showMenu, setShowMenu] = useState(false)

//  useEffect(() => {
//  setLoading(true)
// }, [rasterSource])

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
          <Menu visible={showMenu} setExpanded={setExpanded} />
      
      {/* Map + Layers */}

      <SidebarAttachment
        expanded={expanded}

      >
        <Box
          //className="custom-scrollbar"
          sx={{
            px: [2, 5], py: [1],
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
              top: '8%',
              left: '38%',
              //width: '24px',
              //height: 'calc(100vh)',
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

          <Raster
            colormap={colormap}
            clim={clim}
            display={display}
            opacity={opacity}
            mode={'texture'}
            key={rasterSource}
            source={rasterSource}
            // source={`${bucket_metrics}${year}${month}01_${evaluationMetric}_${forecastModel}.zarr`}
             // `${bucket_metrics}${timeFrame}_${evaluationMetric}_${forecastModel}.zarr`
              // bucket_metrics + '20240401_AE_gc.zarr'
              //'Pyramids/20240501_AE_marsai.zarr'
              //'Pyramids/20240401_AE_gc.zarr' contains t2m and q
              //'Pyramids/20240301_AE_gc.zarr' contains t2m and tp (but tp is empty)
              //'Pyramids/20240301_flat_subset_AE_fc_timestep0.zarr' contains t2m and u10
            
            variable={'climate'}
            version='v2'
            selector={{ band, time }}
            //dimensions={['time', 'y', 'x']}
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
         //   right: showMenu ? ['300px'] : [13], // <-- menu width
            bottom: [17, 17, 15, 15],
            transition: 'right 0.3s ease',
          }}
          >
          <Flex sx={{ gap: [3], alignItems: 'flex-end' }}>
            {/* Date Time Display - show when control panel is expanded*/}
            
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
              delay={200}
              pause = 'max'
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
                This is an interactive tool for exploring the potential
                of machine learning for weather forecasting. The tool allows
                for the performance evaluation of Google DeepMind's GraphCast (deterministic)
                and the ECMWF's AIFS and physics-based deterministic model.
                All models are compared to ERA5 reanalysis data.
              </Box>
              {/* rewrite this intro section -> make it more concise */}

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


/*
      {/* Display Box 
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
          position: 'absolute', // Position it absolute
          top: '7%', // position it at the top
          right: '20px', // Position it on the right side
          transform: 'translateY(-50%)', // Adjust for vertical centering
          zIndex: 10, // Ensure it appears above the map
        }}
      >
          <Box sx={sx.label}>Display</Box>
          <Toggle value={display} onClick={() => setDisplay((prev) => !prev)} />
          </Flex>
      
      */