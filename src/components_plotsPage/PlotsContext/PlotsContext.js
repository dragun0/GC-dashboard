import { createContext, useContext, useState } from 'react'

const PlotsContext = createContext(null)

export const PlotsContextProvider = ({ children }) => {
    // for layer change
    const [month, setMonth] = useState(1)
    const [time, setTime] = useState(0)


    return (
        <PlotsContext.Provider

            value={{
                month,
                setMonth,
                time,
                setTime,
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
        time,
        setTime,
    } = useContext(PlotsContext)

    return {
        month,
        setMonth,
        time,
        setTime,
    }
}