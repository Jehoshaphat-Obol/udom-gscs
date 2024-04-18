import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/home/Home'
import SideBar from './components/SideBar'
import Error404 from './pages/error/Error404'
import Seats from './pages/seats/Seats'
import Timetable from './pages/timetable/Timetable'
import Report from './pages/report/Report'


const SytemLayout = () => {
  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <Header />
      </header>
      <aside id="sidebar" className="sidebar">
        <SideBar />
      </aside>
      <main id="main" className="main">
        <Outlet />
      </main>
      <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
    </>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin"></Route>
          <Route path="/" element={<SytemLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/seats' element={<Seats />} />
            <Route path='/timetable' element={<Timetable />} />
            <Route path='/report' element={<Report />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
