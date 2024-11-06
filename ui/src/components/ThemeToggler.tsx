import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "./ThemeProvider"
import { MoonIcon, SunIcon } from "./Icons";
import { Button } from "react-bootstrap";

const iconSize = "22";

export const ThemeToggler = () => {
    const theme = useContext(ThemeContext);

    if (!theme || !theme.value)
        return null;

    const toggleTheme = () => {
        if (theme === null || theme.setTheme === null) return;

        theme?.setTheme(prev => {
            if (prev === "dark") return "light";
            return "dark";
        }
        );
    }

    return (
        <div style={{ marginTop: '0px' }}>
            <Button variant="dark" onClick={toggleTheme}>
                {theme.value == "light" ?
                    <MoonIcon size={iconSize} />
                    :
                    <SunIcon size={iconSize} />}
            </Button>
        </div>
    );
}