import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {apiGet} from "../../utils/api";
import {authToken} from "../../utils/constants";
import {Button, ButtonGroup, Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
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
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const {id} = useParams();
    const [sensor, setSensor] = useState<any>([]);
    const [samples, setSamples] = useState<any>([]);
    const [startDate, setStartDate] = useState<any>(moment().subtract(1, 'week').startOf('day').toISOString());
    const [endDate, setEndDate] = useState<any>(undefined);
    const [activeButton, setActiveButton] = useState('lastWeek');

    useEffect(() => {
        apiGet("/sensors/" + id, authToken).then((res) => {
            setSensor(res.data);
        }).catch((err) => {
            console.error("sensor error", err);
        });
    }, []);

    useEffect(() => {
        let args = "?sensorId=" + id;
        if (startDate) {
            args += "&startDate=" + startDate;
        }
        if (endDate) {
            args += "&endDate=" + endDate;
        }
        apiGet("/samples" + args, authToken).then((res) => {
            setSamples(res.data.samples);
        }).catch((err) => {
            console.error("samples error", err);
        });
    }, [startDate, endDate]);

    const handleButtonClick = (startDate: string | undefined, endDate: string | undefined, buttonName: string) => {
        setActiveButton(buttonName);
        setStartDate(startDate);
        setEndDate(endDate);
    };

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
        <Stack spacing={3} style={{marginTop: 30, marginBottom: 50}}>
            <Stack direction={isMobile ? "column" : "row"} spacing={3} style={{margin: 10}}>
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
            <Stack direction={isMobile ? "column" : "row"} spacing={5} style={{marginTop: 50}}>
                <InfoCard
                    title={"Last value"}
                    value={(samples.length > 0 ? (samples[samples.length - 1].value as string) : "-") + (sensor.unit ? (" " + sensor.unit) : "")}
                    description={samples.length > 0 ?
                        "Last " + moment(samples[samples.length - 1].createdAt).fromNow()
                        :
                        ""}
                />
                <InfoCard
                    title={"Total samples"}
                    value={samples.length}
                    description={samples.length > 0 ?
                        "First " + moment(samples[0].createdAt).fromNow()
                        :
                        ""}
                />
            </Stack>
            <Divider sx={{margin: 1}}/>
            <Stack direction={"row"} spacing={3} style={{marginTop: 20}}>
                <ButtonGroup className={isMobile ? "button-group-mobile" :"button-group"} variant="outlined" aria-label="outlined button group">
                    <Button
                        className={activeButton === 'lastHour' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'hours').toISOString(), undefined, 'lastHour')}
                    >
                        Last hour
                    </Button>
                    <Button
                        className={activeButton === 'last6Hours' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(6, 'hours').toISOString(), undefined, 'last6Hours')}
                    >
                        Last 6 hours
                    </Button>
                    <Button
                        className={activeButton === 'last12Hours' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(12, 'hours').toISOString(), undefined, 'last12Hours')}
                    >
                        Last 12 hours
                    </Button>
                    <Button
                        className={activeButton === 'today' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().startOf('day').toISOString(), undefined, 'today')}
                    >
                        Today
                    </Button>
                    <Button
                        className={activeButton === 'yesterday' ? 'active' : ''}
                        onClick={() =>
                            handleButtonClick(
                                moment().subtract(1, 'days').startOf('day').toISOString(),
                                moment().subtract(1, 'days').endOf('day').toISOString(),
                                'yesterday'
                            )
                        }
                    >
                        Yesterday
                    </Button>
                    <Button
                        className={activeButton === 'lastWeek' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'week').startOf('day').toISOString(), undefined, 'lastWeek')}
                    >
                        Last week
                    </Button>
                    <Button
                        className={activeButton === 'lastMonth' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'month').startOf('day').toISOString(), undefined, 'lastMonth')}
                    >
                        Last month
                    </Button>
                    <Button
                        className={activeButton === 'all' ? 'active' : ''}
                        onClick={() => handleButtonClick(undefined, undefined, 'all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={5} style={{marginTop: 50}}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3}} color="text.secondary" variant="h6">
                            Chart
                        </Typography>
                        {samples.length > 0 &&
                            <LineChart
                                xAxis={[
                                    {
                                        data: samples.map((sample: any) => moment(sample.createdAt)),
                                        scaleType: 'time',
                                    },
                                ]}
                                series={[
                                    {
                                        data: samples.map((sample: any) => sample.value),
                                        area: true,
                                    },
                                ]}
                                width={isMobile ? width - 50 : 500}
                                height={400}
                            />}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3, marginBottom: 3}} color="text.secondary"
                                    variant="h6">
                            History table
                        </Typography>
                        {samples.length > 0 &&
                            <TableContainer component={Paper}>
                                <Table sx={{minWidth: isMobile ? width - 50 : 400}} size="small"
                                       aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Value</TableCell>
                                            <TableCell align="right">Activity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(samples.map((sample: any) => ({
                                            value: sample.value + (sensor.unit ? (" " + sensor.unit) : ""),
                                            activity: moment(sample.createdAt).fromNow()
                                        })).reverse().splice(0, 10) as any).map((row: any) => (
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
