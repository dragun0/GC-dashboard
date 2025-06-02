import { Box, Flex } from 'theme-ui'
import { use, useCallback, useState } from 'react'
import { Slider, Badge, Toggle, Select, Link } from '@carbonplan/components'
import { SidebarFooter } from '@carbonplan/layouts'
import { useRegionContext } from '../components/region'

const sx = {
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    fontSize: [1, 1, 1, 2],

    // fontSize: [1, 1, 1, 2],
    // mt: [3],
  },
}

const TimeSlider = () => {
  const { time, setTime } = useRegionContext()

  const [sliding, setSliding] = useState(false)

  const handleMouseUp = useCallback(() => {
    setSliding(false) // Stop sliding when the user releases the slider
  }, [])

  const handleMouseDown = useCallback(() => {
    setSliding(true) // Start sliding when the user clicks on the slider
  }, [])

  const formattedLeadTime = (() => {
    const leadTime = time * 0.25 // each unit of time is 6 hours
    return `${leadTime} DAYS`
  }
  )()


  return (
    <SidebarFooter
      sx={{
        pt: [3],
        pb: [2],
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Slider
          min={0}
          max={40}
          value={time}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onChange={(e) => setTime(parseFloat(e.target.value))}
        />
        <Flex sx={{ justifyContent: 'center', mt: 2 }}>
          <Box
            sx={{
              ...sx.label,
              color: sliding ? 'primary' : 'secondary', // Change color based on sliding state
              transition: 'color 0.2s',
            }}
          >
            {formattedLeadTime}
          </Box>
        </Flex>

      </Box>
    </SidebarFooter>
  )
}

export default TimeSlider

/*
const TimeSlider = () => {
  const {
    time,
    setTime,
  } = useRegionContext()

  const [updatingTime, setUpdatingTime] = useState(false)
  const [sliding, setSliding] = useState(false)
  const [scale, setScale] = useState(false)
  const [debounce, setDebounce] = useState(false)
  const [showValue, setShowValue] = useState(false)
//const setUpdatingTime = useDatasetsStore((state) => state.setUpdatingTime)
//const sliding = useDatasetsStore((state) => state.slidingTime)
//const setSliding = useDatasetsStore((state) => state.setSlidingTime)


  const handleMouseUp = useCallback(() => {
    setSliding(false)
    setUpdatingTime(false)
  }, [sliding, updatingTime])

  const handleMouseDown = useCallback(() => {
    setSliding(true)
    if (debounce) setUpdatingTime(true)
  }, [debounce, sliding, updatingTime])


  return (
    <SidebarFooter
      sx={{
       // pointerEvents: !disabled ? 'all' : 'none',
        pt: [3],
      }}
    >


    <Box sx={{ flex: 1 }}>
          <Slider
            min={1}
            max={40}
            value={time}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onChange={(e) => setTime(parseFloat(e.target.value))}
            //sx={{ display: 'inline-block' }}
          />
          <Flex sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            ...sx.label,
            color: sliding ? 'primary' : 'secondary',
            opacity: sliding || showValue ? 1 : 0,
            transition: 'opacity 0.2s, color 0.2s',
          }}
        >
          {time.toFixed(0)}
        </Box>
      </Flex> 

          <Badge
              sx={{
                bg: 'primary',
                color: 'background',
                display: 'inline-block',
                fontSize: [1, 1, 1, 2],
                height: ['21px', '21px', '21px', '23px'],
                position: 'relative',
                left: [3],
                top: [1],
              }}
            >
              {time.toFixed(0)}
            </Badge>

            </Box> 
            </SidebarFooter>
          
  )

}

export default TimeSlider

*/