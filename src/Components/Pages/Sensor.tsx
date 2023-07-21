import React from 'react';
import {useParams} from "react-router-dom";
const Sensor = () => {
    const {id} = useParams();

    return (
        <>
            Sensor {id}
        </>
    )
};
export default Sensor;
