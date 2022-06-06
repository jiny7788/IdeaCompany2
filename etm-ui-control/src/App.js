import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

import { DashboardLayout } from './components/DashboardLayout';
import Customers from './pages/customer';
import Products from './pages/products';
import NotFound from './pages/404';
import Knowledges from './pages/Knowledges';
import ReadKnowledge from './components/knowledge/ReadKnowledge';
import CreateKnowledge from './components/knowledge/CreateKnowledge';

class App extends Component {
  
  render() {

    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DashboardLayout>
          <Routes>
              <Route path="/" element={<Customers />} />
              <Route path="/knowledges" element={<Knowledges />} />
              <Route path="/knowledges/:pageno" element={<Knowledges />} />
              <Route path="/read-knowledge/:no&:pageno" element={ <ReadKnowledge />} />
              <Route path="/create-knowledge/:no&:pageno" element={ <CreateKnowledge />} />
              <Route path="/create-knowledge" element={ <CreateKnowledge />} />
              <Route path="/products" element={<Products />} />
              <Route path="*" element={<NotFound />} />
          </Routes>            
          </DashboardLayout>
        </ThemeProvider>      
      </BrowserRouter>
    );
  }
}

export default App;