import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {apiGet} from "../../utils/api";
import {authToken} from "../../utils/constants";
import {Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import moment from 'moment';
import {LineChart} from "@mui/x-charts";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Sensor = () => {
    const {id} = useParams();
    const [sensor, setSensor] = useState<any>([]);
    const [samples, setSamples] = useState<any>([]);
    const [timestamps, setTimestamps] = useState<any>([]);
    const [values, setValues] = useState<any>([]);
    const [tableRows, setTableRows] = useState<any>([]);

    useEffect(() => {
        apiGet("/sensors/" + id, authToken).then((res) => {
            setSensor(res.data);
        }).catch((err) => {
            console.error("sensor error", err);
        });

        setInterval(() => {
            apiGet("/samples?sensorId=" + id, authToken).then((res) => {
                setSamples(res.data.samples);
                setTimestamps(res.data.samples.map((sample: any) => moment(sample.createdAt)));
                setValues(res.data.samples.map((sample: any) => sample.value + (sensor.unit ? (" " + sensor.unit) : "")));
                setTableRows(res.data.samples.map((sample: any) => ({
                    value: sample.value + (sensor.unit ? (" " + sensor.unit) : ""),
                    activity: moment(sample.createdAt).fromNow()
                })).reverse().splice(0, 10) as any);
            }).catch((err) => {
                console.error("samples error", err);
            });
        }, 10000);
    }, []);

    const InfoCard = ({title, value, description}: { title: any, value: any, description: any }) => (
        <Card>
            <CardContent>
                <Typography sx={{fontWeight: 'bold', marginX: 3}} color="text.secondary" variant="h6">
                    {title}
                </Typography>
                <Typography sx={{fontWeight: 'bold', margin: 3}} color="primary" variant="h3">
                    {value}
                </Typography>
                <Divider sx={{margin: 2}}/>
                <Typography sx={{margin: 1}} color="text.secondary" variant="body2">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Stack spacing={10} style={{marginTop: 30, marginBottom: 50}}>
            <Stack direction={"row"} spacing={3} style={{margin: 10}}>
                <Typography sx={{fontWeight: 'bold'}} color="primary" variant="h5">
                    {sensor.name}
                </Typography>
                <Stack direction={"row"} spacing={1}>
                    {sensor.tags && sensor.tags.map((tag: string) => (
                        <Chip color="primary" variant="outlined" label={tag}/>
                    ))}
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={3} style={{margin: 10}}>
                <Typography color="text.secondary" variant="body1">
                    {sensor.description}
                </Typography>
            </Stack>
            <Stack direction={"row"} spacing={5} style={{marginTop: 50}}>
                <InfoCard
                    title={"Last value"}
                    value={samples.length > 0 ? samples[samples.length - 1].value as string : "-" + (sensor.unit ? (" " + sensor.unit) : "")}
                    description={samples.length > 0 ?
                        "Last activity " + moment(samples[samples.length - 1].createdAt).fromNow()
                        :
                        ""}
                />
                <InfoCard
                    title={"Total samples"}
                    value={samples.length}
                    description={samples.length > 0 ?
                        "Started activity " + moment(samples[0].createdAt).fromNow()
                        :
                        ""}
                />
            </Stack>
            <Stack direction={"row"} spacing={5} style={{marginTop: 50}}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3}} color="text.secondary" variant="h6">
                            Chart
                        </Typography>
                        {timestamps.length > 0 && values.length > 0 &&
                            <LineChart
                                xAxis={[
                                    {
                                        data: timestamps,
                                        scaleType: 'time',
                                    },
                                ]}
                                series={[
                                    {
                                        data: values,
                                        area: false,
                                    },
                                ]}
                                width={500}
                                height={400}
                            />}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3, marginBottom: 3}} color="text.secondary" variant="h6">
                            History table
                        </Typography>
                        {tableRows.length > 0 &&
                            <TableContainer component={Paper}>
                                <Table sx={{minWidth: 400}} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Value</TableCell>
                                            <TableCell align="right">Activity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableRows.map((row :any) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.value}
                                                </TableCell>
                                                <TableCell align="right">{row.activity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </CardContent>
                </Card>
            </Stack>
        </Stack>
    )
};
export default Sensor;
