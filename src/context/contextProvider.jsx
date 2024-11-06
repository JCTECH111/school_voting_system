import { createContext, useState, useContext } from "react";

// Create the context with default values
const StateContext = createContext({
    voterToken: null,
    settVoterToken: () => {},
});

// Provider component
export const ContextProvider = ({ children }) => {
    const [voterToken, settVoterToken] = useState("");

    return (
        <StateContext.Provider value={{
            voterToken,
            settVoterToken,
        }}>
            {children}
        </StateContext.Provider>
    );
};

// Custom hook for using the context
export const useStateContext = () => useContext(StateContext);
