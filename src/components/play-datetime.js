import React, { useCallback, useRef, useEffect, useState } from 'react'
import { Box } from 'theme-ui'
import { useRegionContext } from '../components/region'
import { Button } from '@carbonplan/components'
import { Play, Pause } from './icons'

const PlayButtonDateTime = ({
  delay = 100,
  time,
  setTime,
  min = 0,
  max,
  disabled,
  pause = 'min',
  autoPlay = false,
  setAutoPlay,
}) => {
  const { forecastModel, year, month } = useRegionContext()

  const [playing, setPlaying] = useState(false)
  const timeout = useRef(null)
  const timeRef = useRef(time)
  const playingRef = useRef(playing)

  useEffect(() => {
    timeRef.current = time
  }, [time])

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }

  const tick = useCallback(() => {
    timeout.current = setTimeout(() => {
      let next = timeRef.current + 1

      if (next > max) {
        if (pause === 'min') {
          next = min
          clear()
          setPlaying(false)
          return
        } else {
          next = min
        }
      }

      if (pause === 'max' && next === max) {
        setPlaying(false)
        clear()
      }

      timeRef.current = next
      setTime(next)

      // 🔥 Check ref instead of stale state
      if (playingRef.current) {
        tick()
      }
    }, delay)
  }, [delay, max, min, pause, setTime])

  const handlePlayToggle = () => {
    const willPlay = !playing
    setPlaying(willPlay)
    playingRef.current = willPlay

    if (willPlay) {
      tick()
    } else {
      clear()
    }
  }

  useEffect(() => {
    if (autoPlay) {
      setAutoPlay(false)
      setPlaying(true)
      playingRef.current = true
      tick()
    }
  }, [autoPlay, setAutoPlay, tick])

  useEffect(() => {
    if (disabled) {
      setPlaying(false)
      playingRef.current = false
      clear()
      if (setAutoPlay) setAutoPlay(false)
    }
  }, [disabled, setAutoPlay])

  useEffect(() => clear, [])

  const formattedDate = (() => {
    const hour = (forecastModel === 'gc' || forecastModel === 'marsai') ? '06' : '00'
    const baseDate = new Date(`${year}-${month}-01T${hour}:00:00Z`)
    const date = new Date(baseDate.getTime() + time * 6 * 60 * 60 * 1000)
    return date.toISOString().replace('T', ' ').substring(0, 19)
  })()

  return (
    <Button
      size='xs'
      onClick={handlePlayToggle}
      prefix={
        playing ? <Pause sx={{ mr: '10px' }} /> : <Play sx={{ mr: '10px' }} />
      }
      sx={{
        fontFamily: 'mono',
        fontSize: ['9px', 1, 1, 2],
        letterSpacing: 'smallcaps',
        textTransform: 'uppercase',
        mb: 2,
        pr: 11,
        '&:disabled': {
          pointerEvents: 'none',
          color: 'secondary',
        },
      }}
      disabled={disabled}
    >
     
        {formattedDate}
      
    </Button>
  )
}

export default PlayButtonDateTime


/*

<Box
        sx={{
          fontFamily: 'mono',
          fontSize: ['9px', 1, 1, 2],
          letterSpacing: 'smallcaps',
          textTransform: 'uppercase',
          mb: 2,
          pr: 11,
          transition: 'left 0.3s ease',
        }}
      >
        {formattedDate}
      </Box>
*/