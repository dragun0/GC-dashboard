import { Box, Flex } from 'theme-ui'

/*
const SummaryLegend = ({ colors, data, labels, units }) => {
  const rawPercentages = data.map((d) => (d ? d * 100 : 0))
  const nonFractionSum = rawPercentages.reduce(
    (sum, p) => (p >= 1 ? sum + p : sum),
    0
  )
  let percentages
  if (Math.round(nonFractionSum) === 100) {
    percentages = rawPercentages.map((p) => p.toFixed(0))
  } else {
    percentages = rawPercentages.map((p) =>
      p > 0 && p < 1 ? p.toFixed(1) : p.toFixed(0)
    )
  }
  */

const SummaryLegend = ({ colors, data, labels, units }) => {
  const total = data.reduce((sum, d) => sum + Math.abs(d), 0)
  const rawPercentages = data.map((d) => (total === 0 ? 0 : (Math.abs(d) / total) * 100))
  let percentages
  if (Math.round(rawPercentages.reduce((sum, p) => sum + p, 0)) === 100) {
    percentages = rawPercentages.map((p) => p.toFixed(0))
  } else {
    percentages = rawPercentages.map((p) =>
      p > 0 && p < 1 ? p.toFixed(1) : p.toFixed(0)
    )
  }
  return (
    <>
      {labels.map((label, i) => {
        const color = colors[i]
        const percentage = percentages[i]
        return (
          <Box key={label}>
            <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Flex sx={{ gap: 3, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '14px',
                    height: '14px',
                    mt: '2px',
                    backgroundColor: color,
                    display: 'inline-block',
                  }}
                />

                <Flex sx={{ gap: 2, alignItems: 'baseline' }}>
                  <Box
                    sx={{
                      fontFamily: 'faux',
                      letterSpacing: 'smallcaps',
                      fontSize: [1, 1, 1, 2],
                    }}
                  >
                    {label}
                  </Box>
                  {i === 0 && (
                    <Box
                      sx={{
                        fontFamily: 'faux',
                        letterSpacing: 'faux',
                        fontSize: [0, 0, 0, 1],
                        color: 'secondary',
                      }}
                    >
                      {units}
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Flex sx={{ gap: 2, alignItems: 'baseline' }}>
                <Box
                  sx={{
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                    fontSize: [1, 1, 1, 2],
                  }}
                >
                  {percentage}
                </Box>
                <Box
                  sx={{
                    fontFamily: 'faux',
                    letterSpacing: 'faux',
                    fontSize: [0, 0, 0, 1],
                    color: 'secondary',
                  }}
                >
                  %
                </Box>
              </Flex>
            </Flex>
            <Box
              sx={{
                mb: 1,
                height: '2px',
                background: ({ colors: { muted } }) =>
                  `linear-gradient(to right, ${color} ${percentage}%, ${muted} ${percentage}% 100%)`,
              }}
            />
          </Box>
        )
      })}
    </>
  )
}
export default SummaryLegend