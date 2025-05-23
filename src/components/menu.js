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
    color: 'text',
  },
}

function Menu({ visible, setExpanded }) {
    const router = useRouter()

  const handleMapClick = () => {
    if (router.pathname === '/plotsPage') {
      router.push('/')
    } else {
      setExpanded(true)
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
        width: visible
          ? [
              0,
              'calc(2 * 100vw / 8 + 18px - 1px)',
              'calc(2 * 100vw / 12 + 24px - 1px)',
              'calc(2 * 100vw / 12 + 35px)',
            ]
          : [
              0,
              'calc(2 * 100vw / 8 + 18px)',
              'calc(2 * 100vw / 12 + 24px)',
              'calc(2 * 100vw / 12 + 35px)',
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
            sx={{ textDecoration: 'none' }}
            href="/plotsPage"
            sx={{
              ...link,
             
            }}
          >
            Explainer
          </Link>
          <Link
            sx={{ textDecoration: 'none' }}
            href='https://carbonplan.org/research'
            sx={{
              ...link,
             
            }}
          >
            Paper
          </Link>
          
          
        </Column>
      </Row>
    </Box>
  )
}

export default Menu