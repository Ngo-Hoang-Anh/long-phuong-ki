import Layout from './components/Layout'
import { authRoutes, userRoutes } from './routes/allRoutes'
import { Redirect, Switch } from "react-router-dom";
import Authmiddleware from "./routes/middleware/Authmiddleware";
import axiosApi, { setRequestInterceptor } from './helpers/axiosHelper';
import { useTheme } from './components/common/ThemeProvider';
import { useEffect } from 'react';
setRequestInterceptor(axiosApi)
function App() {
    const { theme } = useTheme();
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);
    return (
        <div data-theme={theme}>
            <Switch>
                {authRoutes.map((route, idx) => (
                    <Authmiddleware
                        path={route.path}
                        layout={Layout}
                        component={route.component}
                        key={idx}
                        isAuthProtected={false}
                    />
                ))}
                {userRoutes.map((route, idx) => (
                    <Authmiddleware
                        path={route.path}
                        layout={Layout}
                        component={route.component}
                        key={idx}
                        isAuthProtected={true}
                        exact
                    />
                ))}
                <Redirect to={'/lobby'} />
            </Switch>
        </div>
    )
}

export default App
