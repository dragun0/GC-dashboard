import { Box, Flex } from 'theme-ui'
import { useCallback } from 'react'
import { Row, Column, Filter, Slider, Badge, Toggle, Select, Link } from '@carbonplan/components'
import { colormaps } from '@carbonplan/colormaps'
import { useRegionContext } from './region'
import { useState } from 'react'
import TooltipWrapper from './tooltip-wrapper'

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
        letterSpacing: 'smallcaps',
        textTransform: 'uppercase',
        fontSize: [2, 2, 2, 3],
        mb: [3],
    },
}




const DisplaySection = () => {
    const {
        opacity,
        setOpacity,
        clim,
        setClim,
        band,
        setBand,
        display,
        setDisplay,
        colormapName,
        setColormapName,
        basemap,
        setBasemap,
    } = useRegionContext()

    // for UI buttons only:
    // value of basemap is stored in context state
    // const [uiBasemap, setUiBasemap] = useState({ oceanMask: true, landMask: false })

    // Toggle states for basemap toggle button
    const oceanMaskOn = basemap === 'oceanMask'
    const landMaskOn = basemap === 'landMask'


    return (
        <Box>
            <>
                <TooltipWrapper
                    tooltip='Use the drop down menu to choose a colormap or switch the layer on/off. Click and drag
        the colorbar limits of the legend in the lower right corner to change them. Click the "sun" in the lower right
        to switch between light mode and dark mode. Toggle the ocean and land masks on/off to hide or show these parts of the map.'
                    placement='top'
                >
                    <Box sx={{ ...sx.heading, mb: [0] }}>Display</Box>
                </TooltipWrapper>
                <Box sx={{ pt: [3] }}>

                    <>
                        <Row columns={[6, 8, 4, 4]}>
                            <Column start={1} width={[6, 4, 2, 2]}>
                                <Box sx={{ ...sx.label, mb: 2 }}>
                                    Colormap
                                    <Select
                                        value={colormapName}
                                        onChange={(e) =>
                                            setColormapName(e.target.value)}

                                        size='xs'
                                        sx={{
                                            mt: [1],
                                            display: 'block',
                                        }}
                                        sxSelect={{
                                            textTransform: 'uppercase',
                                            fontFamily: 'mono',
                                            fontSize: [1, 1, 1, 2],
                                            width: '100%',
                                            pb: [1],
                                        }}
                                    >
                                        {colormaps.map((d) => (
                                            <option key={d.name}>{d.name}</option>
                                        ))}
                                    </Select>
                                </Box>
                            </Column>

                            <Column start={[1, 1, 3, 3]} width={[6, 4, 2, 2]}>
                                <Box sx={{ ...sx.label, mb: 2 }}>
                                    Layer I/O
                                    <Column start={1} width={[6, 4, 4, 4]}>
                                        <Box sx={{ pt: 2 }}>
                                            <Toggle value={display} onClick={() => setDisplay((prev) => !prev)} />
                                        </Box>
                                    </Column>



                                </Box>
                            </Column>
                        </Row>

                        <Row columns={[6, 8, 4, 4]}>
                            <Column start={1} width={[6, 4, 2, 2]}>
                                <Box sx={{ ...sx.label, mb: 2, mt: 2 }}>
                                    BASEMAPS

                                </Box>

                            </Column>

                            <Column start={[1, 1, 3, 3]} width={[3]}>

                                <Flex sx={{ gap: 2, mb: 2, mt: 2, fontSize: [2, 2, 2, 3] }}>
                                    Ocean mask
                                    <Toggle
                                        label="Ocean Mask"
                                        value={oceanMaskOn}
                                        onClick={() => setBasemap(oceanMaskOn ? null : 'oceanMask')}
                                    />
                                </Flex>
                                <Flex sx={{ gap: 2, mb: 2, fontSize: [2, 2, 2, 3] }}>
                                    Land mask
                                    <Toggle
                                        label="Land Mask"
                                        value={landMaskOn}
                                        onClick={() => setBasemap(landMaskOn ? null : 'landMask')}
                                    />
                                </Flex>


                            </Column>
                        </Row>


                    </>

                </Box>

            </>
        </Box>


    )

}

export default DisplaySection



/*
                    <Column start={[1, 1, 3, 3]} width={[6, 4, 2, 2]}>
                    <Box sx={{ ...sx.label, mb: 2 }}>
                        Units
                        <Select
                        value={displayUnits}
                        onChange={(e) => setDisplayUnits(e.target.value)}
                        size='xs'
                        sx={{
                            mt: [1],
                            display: 'block',
                        }}
                        sxSelect={{
                            fontFamily: 'mono',
                            fontSize: [1, 1, 1, 2],
                            width: '100%',
                            pb: [1],
                        }}
                        >
                        {UNITS_OPTIONS[variable].map(({ value, label }) => (
                            <option key={value} value={value}>
                            {label}
                            </option>
                        ))}
                        </Select>
                    </Box>
                    </Column>

                    <Column start={1} width={[6, 4, 4, 4]}>
                    <Box>
                        <Box sx={{ ...sx.label, mb: '5px' }}>
                        {variable} (
                        <Box as='span' sx={{ textTransform: 'none' }}>
                            {
                            UNITS_OPTIONS[variable].find(
                                ({ value }) => value === displayUnits
                            )?.label
                            }
                        </Box>
                        )
                        </Box>
                        <Colorbar
                        colormap={colormap}
                        format={(d) =>
                            Math.round(
                            convertUnits(d, DEFAULT_DISPLAY_UNITS[variable], displayUnits)
                            )
                        }
                        clim={clim}
                        setClim={(setter) => setClim(setter(clim))}
                        horizontal
                        width={'100%'}
                        sxClim={{ fontSize: [1, 1, 1, 2], mt: ['-1px'], pb: ['2px'] }}
                        />
                    </Box>
                    </Column>
*/