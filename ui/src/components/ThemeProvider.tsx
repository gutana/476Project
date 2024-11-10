import { ReactNode, useState, createContext, useEffect } from "react"

interface Props {
    children: ReactNode
}

interface Theme {
    value: string | null,
    setTheme: React.Dispatch<React.SetStateAction<string | null>> | null
}

export const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: Props) => {

    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    useEffect(() => {
        if (theme == null) {
            localStorage.setItem("theme", "dark");
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme'))
                setTheme("dark");
        }
        else {
            localStorage.setItem("theme", theme);
        }

    }, [theme])

    return (
        <ThemeContext.Provider value={{
            value: theme,
            setTheme: setTheme
        }}>
            {children}
        </ThemeContext.Provider>
    )
}