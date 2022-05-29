import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/CustomerListResults';
import { CustomerListToolbar } from '../components/customer/CustomerListToolbar';
import { customers } from '../__mocks__/customers';

const Customers = () => (
    <Box
        component="main"
        sx={{
            flexGrow: 1,
            py: 8
        }}
    >
        <Container maxWidth={false}>
            <CustomerListToolbar />
            <Box sx={{ mt: 3 }}>
                <CustomerListResults customers={customers} />
            </Box>
        </Container>
    </Box>
);

export default Customers;