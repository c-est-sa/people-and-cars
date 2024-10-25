import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import HomePage from "./pages/HomePage";
import PersonPage from "./pages/PersonPage";

const defaultTheme = createTheme();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/people/:id" element={<PersonPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
