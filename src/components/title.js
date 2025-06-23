import { useRef } from 'react'
import { useColorMode } from 'theme-ui'

import { Box } from 'theme-ui'
import { Column, Link, Row } from '@carbonplan/components'

const Title = ({ expanded, setExpanded }) => {
  const hasExpanded = useRef(false)
  const [colorMode] = useColorMode()

  hasExpanded.current ||= expanded

  return (
    <Box
      sx={{
        display: [
          hasExpanded.current ? 'none' : 'inherit',
          hasExpanded.current ? 'none' : 'inherit',
          'inherit',
          'inherit',
        ],
        pointerEvents: 'none',
      }}
    >
      <Row>
        <Column start={[1, 2, 7, 7]} width={[5, 5, 5, 5]}>
          <Box
            sx={{
              mt: [9],
              opacity: expanded ? 0 : 1,
              transition: 'opacity 0.3s',
              position: 'relative',
              display: 'block',
              zIndex: 1001,
              fontSize: [6, 7, 7, 8],
              letterSpacing: 'heading',
              fontFamily: 'heading',
              lineHeight: 'heading',
              pointerEvents: 'none',
              userSelect: 'none',
              textShadow: `0px 0px 20px ${colorMode === 'dark' || !colorMode ? 'black' : 'white'
                }`,
            }}
          >
            Mapping Weather Forecast Performances <br /> AI vs. Physics
          </Box>
          <Box
            sx={{
              mt: [3],
              opacity: expanded ? 0 : 1,
              transition: 'opacity 0.3s',
              position: 'relative',
              display: 'block',
              zIndex: 1001,
              fontSize: [2, 3, 3, 4],
              pointerEvents: 'none',
              userSelect: 'none',
              textShadow: `0px 0px 20px ${colorMode === 'dark' || !colorMode ? 'black' : 'white'
                }`,
            }}
          >
            Test ML weather predictions against NWP models. Read the {' '}
            <Link
              href='https://www.google.com/search?q=hello+world&sca_esv=01250f61e108407c&rlz=1C5CHFA_enIT1108IT1108&sxsrf=AE3TifMKmwnlyRKUhJo_27yxBlhJS8TpOA%3A1750061586436&ei=EtJPaMirGrOpi-gP9tzP6Qw&ved=0ahUKEwjI_Ma5v_WNAxWz1AIHHXbuM80Q4dUDCBA&uact=5&oq=hello+world&gs_lp=Egxnd3Mtd2l6LXNlcnAiC2hlbGxvIHdvcmxkMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHSK8EUOkCWOkCcAF4ApABAJgBAKABAKoBALgBA8gBAPgBAZgCAqACEsICChAAGLADGNYEGEfCAg0QABiABBiwAxhDGIoFwgIOEAAYsAMY5AIY1gTYAQHCAhMQLhiABBiwAxhDGMgDGIoF2AEBmAMA4gMFEgExIECIBgGQBgi6BgYIARABGAmSBwEyoAcAsgcAuAcAwgcFMi0xLjHIBw8&sclient=gws-wiz-serp'
              sx={{ pointerEvents: expanded ? 'none' : 'all' }}
            >
              paper
            </Link>
            , use the forecast {' '}
            <Link
              href="/plotsPage"
              sx={{ pointerEvents: expanded ? 'none' : 'all' }}
            >
              analyser
            </Link>

            , and explore the {' '}
            <Link
              onClick={() => setExpanded(true)}
              sx={{ pointerEvents: expanded ? 'none' : 'all' }}
            >
              map
            </Link>

          </Box>
        </Column>
      </Row>
    </Box>
  )
}

export default Title

/*
Read the{' '}
            <Link
              href='https://doi.org/10.1038/s41477-022-01305-9'
              sx={{ pointerEvents: expanded ? 'none' : 'all' }}
            >
              blog
            </Link>{' '}
            and{' '}
            <Link
              href='/research/seaweed-farming-explainer'
              sx={{ pointerEvents: expanded ? 'none' : 'all' }}
            >
              explainer
*/