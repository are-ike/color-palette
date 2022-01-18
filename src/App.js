import './App.css';
import ListOfFiles from './pages/files/index'
import Palette from './pages/palette/index'
import PageNotFound from './pages/404/index'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <>
      <ToastContainer hideProgressBar/>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<ListOfFiles/>} />
          <Route path="/files" element={<ListOfFiles/>} />
          <Route path="/palette/:id" element={<Palette/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
