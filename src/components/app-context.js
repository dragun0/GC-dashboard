/*
import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const RegionProvider = ({ children }) => {
  const [regionData, setRegionData] = useState(null)
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  return (
    <RegionContext.Provider
      value={{
        regionData,
        setRegionData,
        showRegionPicker,
        setShowRegionPicker,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export const useRegionContext = () => {
    const context = useContext(RegionContext) // for debugging
    console.log('RegionContext:', context) // for debugging: Log the entire context object
  const { regionData, setRegionData, showRegionPicker, setShowRegionPicker } =
    useContext(RegionContext)

  return {
    regionData,
    setRegionData,
    showRegionPicker,
    setShowRegionPicker,
  }
}

*/