
type Sensor = {
    id: string;
    name: string;
    tags: string[];
    description: string;
    unit: string;
    allowedUsers: string[];
    location: {
        latitude: string;
        longitude: string;
        altitude: number;
    },
    createdAt: string;
    updatedAt: string;
};
