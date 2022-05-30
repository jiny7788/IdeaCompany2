import { Box, Container } from '@mui/material';
import { KnowledgeList } from '../components/knowledge/KnowledgeList';
import { KnowledgeToolbar } from '../components/knowledge/KnowledgeToolbar';
import { customers } from '../__mocks__/customers';
import { useParams } from 'react-router-dom';

const Knowledges = () => {
    const {pageno} = useParams();

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
                    <KnowledgeList pageno={pageno} />
                </Box>
            </Container>
        </Box>
    );
};


export default Knowledges;