import { Box, Container } from '@mui/material';
import { KnowledgeList } from '../components/knowledge/KnowledgeList';
import { KnowledgeToolbar } from '../components/knowledge/KnowledgeToolbar';
import { customers } from '../__mocks__/customers';
import { Link, Routes, Route } from 'react-router-dom';

const Knowledges = ({ match }) => {
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth={false}>
                <KnowledgeToolbar />
                <Box sx={{ mt: 3 }}>
                    <KnowledgeList customers={customers} />
                </Box>
            </Container>
        </Box>
    );
};


export default Knowledges;