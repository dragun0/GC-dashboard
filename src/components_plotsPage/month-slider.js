import React, { useCallback, useRef, useEffect, useState } from 'react'
import { Slider, Row } from '@carbonplan/components'
import { Box } from 'theme-ui'
import { usePlotsContext } from './PlotsContext'
import { Button } from '@carbonplan/components'
import { Play, Pause } from '../components/icons'
import { set } from 'ol/transform'

const MonthSlider = (props) => {
    const context = usePlotsContext()
    const month = props.month ?? context.month
    const setMonth = props.setMonth ?? context.setMonth

    const {
        delay = 100,
        min = 1,
        max = 12,
        disabled,
        pause = 'max',
        autoPlay = false,
        setAutoPlay,
    } = props


    const [playing, setPlaying] = useState(false)
    const timeout = useRef(null)
    const monthRef = useRef(month)
    const playingRef = useRef(playing)

    useEffect(() => {
        monthRef.current = month
    }, [month])

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
            let next = monthRef.current + 1

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

            monthRef.current = next
            setMonth(next)

            // Check ref instead of stale state
            if (playingRef.current) {
                tick()
            }
        }, delay)
    }, [delay, max, min, pause, setMonth])

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

    const formattedMonth = (() => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return `${monthNames[month - 1]} 2024`
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
                    {formattedMonth}
                </Button>
            </Box>

            <Box sx={{ maxWidth: 250 }}>
                <Slider
                    min={1}
                    max={12}
                    value={month}
                    onChange={(e) => setMonth(parseFloat(e.target.value))}
                />
            </Box>
        </Box>
    )
}

export default MonthSlider