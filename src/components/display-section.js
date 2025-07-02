import { Box, Flex } from 'theme-ui'
import { Row, Column, Toggle, Select } from '@carbonplan/components'
import { colormaps } from '@carbonplan/colormaps'
import { useRegionContext } from './region'
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
        colormapName,
        setColormapName,
        basemap,
        setBasemap,
    } = useRegionContext()

    // Toggle states for basemap toggle button
    const oceanMaskOn = basemap === 'oceanMask'
    const landMaskOn = basemap === 'landMask'


    return (
        <Box>
            <>
                <TooltipWrapper
                    tooltip='Use the drop down menu to choose a colormap or switch the ocean and land masks on/off. Click and drag
        the colorbar limits of the legend in the lower right corner to change them. Click the "sun" in the lower right
        to switch between light mode and dark mode.'
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
                                            value={basemap.oceanMask}
                                            onClick={() => setBasemap((prev) => ({ ...prev, oceanMask: !prev.oceanMask }))}
                                        />
                                    </Flex>
                                    <Flex sx={{ gap: 2, mb: 2, fontSize: [2, 2, 2, 3] }}>
                                        Land mask
                                        <Toggle
                                            label="Land Mask"
                                            value={basemap.landMask}
                                            onClick={() => setBasemap((prev) => ({ ...prev, landMask: !prev.landMask }))}
                                        />
                                    </Flex>
                                </Column>
                            </Column>
                        </Row>
                    </>
                </Box>
            </>
        </Box>
    )
}

export default DisplaySection

