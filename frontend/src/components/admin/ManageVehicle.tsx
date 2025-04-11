import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InVehicle from './InVehicle';
import OutVehicle from './OutVehicle';
import History from './History';

// import ChangePassword from './ChangePassword';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/backend';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Profiledata = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="profile data tabs">
          <Tab label="In-Vehicle" {...a11yProps(0)} />
          <Tab label="Out-Vehicle" {...a11yProps(1)} />
          <Tab label="History" {...a11yProps(2)} />
          
        </Tabs> 
      </Box>
      <CustomTabPanel value={value} index={0}>
        <InVehicle/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <OutVehicle />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <History />
      </CustomTabPanel>
      
    </Box>
  );
};

export default Profiledata;
