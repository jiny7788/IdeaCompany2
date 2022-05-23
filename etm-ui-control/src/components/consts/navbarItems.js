import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import GiteIcon from '@mui/icons-material/Gite';
import FunctionsIcon from '@mui/icons-material/Functions';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';


export const mainNavbarItems = [
    {
        id: 0,
        icon: <PeopleIcon />,
        label: 'Authentication',
        route: 'authentication',
    },
    {
        id: 1,
        icon: <DataThresholdingIcon />,
        label: 'Database',
        route: 'database',
    },
    {
        id: 2,
        icon: <StorageIcon />,
        label: 'Storage',
        route: 'storage',
    },
    {
        id: 3,
        icon: <GiteIcon />,
        label: 'Hosting',
        route: 'hosting',
    },
    {
        id: 4,
        icon: <FunctionsIcon />,
        label: 'Functions',
        route: 'functions',
    }
];