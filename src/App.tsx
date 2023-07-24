import React, {useEffect, useState} from 'react';
import './App.css';
import {Container} from '@mui/material';
import NavBar from "./Components/NavBars/NavBar";
import SensorsList from "./Components/Pages/SensorsList";
import Dashboard from "./Components/Pages/Dashboard";
import {Outlet, Route, Routes, useLocation} from "react-router-dom";
import Sensor from "./Components/Pages/Sensor";
import {apiGet} from "./utils/api";
import {authToken} from "./utils/constants";

const routesNameMap: { [key: string]: string } = {
    "/": "Dashboard",
    "/sensors": "Sensors",
    "/sensor/([a-zA-Z0-9]+)": "Sensor details"
};

function findPageName(path: string): string {
    for (const key in routesNameMap) {
        const regex = new RegExp("^" + key.replace(/:[a-zA-Z]+/g, "[a-zA-Z0-9]+") + "$");
        if (regex.test(path)) {
            return routesNameMap[key];
        }
    }
    return "404 Not Found";
}

function App() {
    const location = useLocation();
    const [sensors, setSensors] = useState<any>([]);

    useEffect(() => {
        apiGet("/sensors", authToken).then((res) => {
            setSensors(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    return (
        <Routes>
            <Route path={"/"} element={<Layout currentPageTitle={findPageName(location.pathname)}/>}>
                <Route index element={<Dashboard sensors={sensors} />} />
                <Route path={"/sensors"} element={<SensorsList sensors={sensors}/>}/>
                <Route path={"/sensor/:id"} element={<Sensor />}/>

                <Route path="*" element={<>not found</>}/>
            </Route>
        </Routes>
    );
}

const Layout = ({currentPageTitle}: { currentPageTitle: string }) => (
    <>
        <NavBar currentPageTitle={currentPageTitle}/>
        <Container>
            <Outlet/>
        </Container>
    </>
);

export default App;
