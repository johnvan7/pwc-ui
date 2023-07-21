import {Box, Stack} from "@mui/material";
import SensorCard from "../Cards/SensorCard";
import React from "react";
const SensorsList = ({sensors} : {sensors: Sensor[]}) => {

    return (
        <Box marginTop={15}>
            <Stack direction="row" spacing={10}>
                {sensors.map((sensor) => (
                    <SensorCard sensor={sensor} />
                ))}
            </Stack>
        </Box>
    );
}

export default SensorsList;
