import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

import { DashboardLayout } from './components/DashboardLayout';
import Customers from './pages/customer';
import Products from './pages/products';
import NotFound from './pages/404';

class App extends Component {
  
  render() {

    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DashboardLayout>
          <Routes>
              <Route path="/" element={<Customers />}></Route>
              <Route path="/products" element={<Products />}></Route>
              <Route path="*" element={<NotFound />}></Route>
          </Routes>            
          </DashboardLayout>
        </ThemeProvider>      
      </BrowserRouter>
    );
  }
}

export default App;