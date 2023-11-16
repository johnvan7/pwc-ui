export const googleMapToken: string = process.env.REACT_APP_MAPS_TOKEN || '';

export const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
