import './App.css';
import { Box } from "@mui/material"
import { Route, Routes } from "react-router-dom";
import Homepage from './homepage/Homepage';

function App() {
  return (
    <Box className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Box>
  );
}

export default App;
