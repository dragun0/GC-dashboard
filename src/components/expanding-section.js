import { Expander } from '@carbonplan/components'
import { useState } from 'react'
import { Box, Flex } from 'theme-ui'

const sx = {
  heading: {
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
  },
}

const ExpandingSection = ({ label, children, onClick }) => {
  const [expanded, setExpanded] = useState(false)

  const disabled = false

  return (
    <Box>
      <Flex
        sx={{
          justifyContent: 'space-between',
          px: [0],
          gap: 2,
          mb: [0],
          ml: '0px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: disabled ? 'secondary' : 'primary',
          transition: '0.15s',
          '&:hover': disabled
            ? {}
            : { color: 'primary', '& svg': { stroke: 'primary' } },
        }}
        onClick={() => {
          if (!disabled) {
            setExpanded(!expanded)
            onClick && onClick()
          }
        }}
      >
        <Box sx={sx.heading}>{label}</Box>
        <Expander
          value={expanded}
          onClick={() => !disabled && setExpanded(!expanded)}
          sx={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            pointerEvents: disabled ? 'none' : 'all',
          }}
        />
      </Flex>
      {expanded && !disabled && (
        <Flex
          sx={{
            flexDirection: 'column',
            my: 3,
            gap: 4,
          }}
        >
          {children}
        </Flex>
      )}
    </Box>
  )
}

export default ExpandingSection