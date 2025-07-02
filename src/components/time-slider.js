import { Box, Flex } from 'theme-ui'
import { useCallback, useState } from 'react'
import { Slider } from '@carbonplan/components'
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

