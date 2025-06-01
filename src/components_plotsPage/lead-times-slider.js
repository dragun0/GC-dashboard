import React, { useCallback, useRef, useEffect, useState } from 'react'
import { Slider, Row } from '@carbonplan/components'
import { Box } from 'theme-ui'
import { usePlotsContext } from './PlotsContext'
import { Button } from '@carbonplan/components'
import { Play, Pause } from '../components/icons'
import { set } from 'ol/transform'

const LeadTimesSlider = (props) => {
    const context = usePlotsContext()
    const time = props.time ?? context.time
    const setTime = props.setTime ?? context.setTime

    const {
        delay = 100,
        min = 0,
        max = 40,
        disabled,
        pause = 'max',
        autoPlay = false,
        setAutoPlay,
    } = props


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
                    next = max
                }
            }

            if (pause === 'max' && next === max) {
                setPlaying(false)
                clear()
            }

            timeRef.current = next
            setTime(next)

            // Check ref instead of stale state
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

    const formattedLeadTime = (() => {
        const leadTime = time * 0.25 // each unit of time is 6 hours
        return `${leadTime} DAYS`
    }
    )()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    size='xs'
                    onClick={handlePlayToggle}
                    prefix={playing ? <Pause /> : <Play />}
                    sx={{
                        fontFamily: 'mono',
                        fontSize: ['9px', 1, 1, 2],
                        letterSpacing: 'smallcaps',
                        textTransform: 'uppercase',
                        '&:disabled': {
                            pointerEvents: 'none',
                            color: 'secondary',
                        },
                    }}
                    disabled={disabled}
                >
                    {formattedLeadTime}
                </Button>
            </Box>

            <Box sx={{ maxWidth: 250 }}>
                <Slider
                    min={0}
                    max={40}
                    step={1}
                    value={time}
                    onChange={(e) => setTime(parseFloat(e.target.value))}
                />
            </Box>
        </Box>
    )
}

export default LeadTimesSlider