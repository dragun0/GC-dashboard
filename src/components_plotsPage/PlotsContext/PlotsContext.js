import { createContext, useContext, useState } from 'react'

const PlotsContext = createContext(null)

export const PlotsContextProvider = ({ children }) => {
    // for layer change
    const [Column1Region, setColumn1Region] = useState('global')
    const [Column2Region, setColumn2Region] = useState('tropics')


    return (
        <PlotsContext.Provider

            value={{
                Column1Region,
                setColumn1Region,
                Column2Region,
                setColumn2Region,
            }}

        >
            {children}

        </PlotsContext.Provider>
    )
}

export const usePlotsContext = () => {
    const context = useContext(PlotsContext)

    const {
        Column1Region,
        setColumn1Region,
        Column2Region,
        setColumn2Region,
    } = useContext(PlotsContext)

    return {
        Column1Region,
        setColumn1Region,
        Column2Region,
        setColumn2Region,
    }
}