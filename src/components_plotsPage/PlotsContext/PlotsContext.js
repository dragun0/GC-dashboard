import { createContext, useContext, useState } from 'react'

const PlotsContext = createContext(null)

export const PlotsContextProvider = ({ children }) => {
    // for layer change
    const [month, setMonth] = useState(1)


    return (
        <PlotsContext.Provider

            value={{
                month,
                setMonth,
            }}

        >
            {children}

        </PlotsContext.Provider>
    )
}

export const usePlotsContext = () => {
    const context = useContext(PlotsContext)

    const {
        month,
        setMonth,
    } = useContext(PlotsContext)

    return {
        month,
        setMonth,
    }
}