import { Box, Container, Link, Text } from 'theme-ui'
import { default as NextLink } from 'next/link'
import { Row, Column, Arrow } from '@carbonplan/components'
import { useRouter } from 'next/router'



const link = {
  color: 'text',
  fontSize: [5, 5, 5, 6],
  fontFamily: 'heading',
  letterSpacing: 'heading',
  py: [2, 2, 2, 4],
  top: -1,
  borderStyle: 'solid',
  borderColor: 'muted',
  borderWidth: '0px',
  borderBottomWidth: '1px',
  textDecoration: 'none',
  position: 'relative',
  display: 'block',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover > #arrow': {
      opacity: 1,
    },
  },
  '&:hover': {
    color: 'secondaryColor',
  },
}

function Menu({ visible, setExpanded, setShowMenu }) {
  const router = useRouter()

  const handleMapClick = () => {
    if (router.pathname === '/plotsPage') {
      router.push('/')
    } else {
      setExpanded(true)
      setShowMenu(false)
    }
  }

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        position: 'fixed',
        right: 0,
        top: 55,
        width: visible ?
          [
            0,
            'calc(2 * 100vw / 8 + 18px - 1px)',
            'calc(2 * 100vw / 12 + 24px - 1px)',
            'calc(2 * 100vw / 12 + 35px)',
          ]
          : [
            0,
            0
          ],
        height: '110%',
        backgroundColor: 'background',
        zIndex: 1000,
        //  pr: [3, 5, 5, 6],
        pl: [3, 4, 5, 6],
        //   pt: [5, 5, 5, 6],
        mt: -60,
        transition: '0.25s',
      }}
    >
      <Row columns={[3]}>
        <Column start={[1]} width={[3]} sx={{ mt: [7] }}>
          <Link
            sx={{
              ...link,
              borderTopWidth: '1px',
            }}
            onClick={handleMapClick}
          //  onClick={() => setExpanded(true)}

          >
            Map
          </Link>
          <Link
            sx={{ textDecoration: 'none', ...link, }}
            href="/plotsPage"
          >
            Analysis
          </Link>
          <Link
            sx={{ textDecoration: 'none', ...link, }}
            href='https://www.google.com/search?q=hello+world&sca_esv=01250f61e108407c&rlz=1C5CHFA_enIT1108IT1108&sxsrf=AE3TifMKmwnlyRKUhJo_27yxBlhJS8TpOA%3A1750061586436&ei=EtJPaMirGrOpi-gP9tzP6Qw&ved=0ahUKEwjI_Ma5v_WNAxWz1AIHHXbuM80Q4dUDCBA&uact=5&oq=hello+world&gs_lp=Egxnd3Mtd2l6LXNlcnAiC2hlbGxvIHdvcmxkMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHMgQQABhHSK8EUOkCWOkCcAF4ApABAJgBAKABAKoBALgBA8gBAPgBAZgCAqACEsICChAAGLADGNYEGEfCAg0QABiABBiwAxhDGIoFwgIOEAAYsAMY5AIY1gTYAQHCAhMQLhiABBiwAxhDGMgDGIoF2AEBmAMA4gMFEgExIECIBgGQBgi6BgYIARABGAmSBwEyoAcAsgcAuAcAwgcFMi0xLjHIBw8&sclient=gws-wiz-serp'
          >
            Paper
          </Link>


        </Column>
      </Row>
    </Box>
  )
}

export default Menu