import { ThemeUIProvider } from 'theme-ui'
import theme from '@carbonplan/theme'
import { merge } from 'theme-ui'
import { RegionProvider } from '../components/region/context'
import { PlotsContextProvider } from '../components_plotsPage/PlotsContext/PlotsContext'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import '@carbonplan/maps/mapbox.css'
//import '../styles/globals.css'
import { useState } from 'react'


const App = ({ Component, pageProps }) => {

  return (
    <ThemeUIProvider theme={theme}>
      <RegionProvider>
        <PlotsContextProvider>

          <Component {...pageProps} />

        </PlotsContextProvider>
      </RegionProvider>
    </ThemeUIProvider>
  )
}

export default App
