import './App.css';
import ListOfFiles from './pages/files/index'
import Palette from './pages/palette/index'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/files" element={<ListOfFiles/>} />
        <Route path="/palette/:id" element={<Palette/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
