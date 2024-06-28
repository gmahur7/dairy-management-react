import './App.css';
import { Routes, Route } from 'react-router-dom'
import NewVender from './Components/NewVender';
import VenderTable from './Components/VenderTable';
import SetRateFat from './Components/SetRate_Fat';
import MilkEntry from './Components/MilkEntry';
import AdminLogin from './Components/AdminLogin';
// import Protected from './Components/Protected';
import VenderDetail from './Components/VenderDetail';
import Payment from './Components/Payment';
import VenderPaymentTable from './Components/VenderPaymentTable';
import VenderAllEntries from './Components/VenderAllEntries';
import OneDayMilkDetail from './Components/OneDayMilkDetail';
import LastDaysDetailChart from './Components/LastDaysDetailChart';
import LastDaysPerVenderData from './Components/LastDaysPerVenderData';
import VenderMain from './Components/VenderMain';
import DetailsChart from './Components/DetailsChart';

function App() {

  document.title = "Dairy Management App"

  return (
      <Routes>
        <Route path='/adminlogin' element={<AdminLogin />} />
        {/* <Route path='/forgetpassword' element={<ForgetPassword/>} /> */}
        {/* <Route element={<Protected />}> */}
        <Route path='/vender/payments/:id' element={<VenderPaymentTable />} />
        <Route path='/vendor' element={<VenderMain />} />
        <Route path='/vender/:id' element={<VenderDetail />} />
        <Route path='/vender/all/:id' element={<VenderAllEntries />} />
        <Route path='/' element={<MilkEntry />} />
        <Route path='/payment/:id' element={<Payment />} />
        <Route path='/vendertable' element={<VenderTable />} />
        <Route path='/newvender' element={<NewVender />} />
        <Route path="/details" element={<DetailsChart />} />
        <Route path='/perdaydetail' element={<OneDayMilkDetail />} />
        <Route path='/updatedetail/:id' element={<SetRateFat />} />
        <Route path='/lastdaysdetailchart' element={<LastDaysDetailChart />} />
        <Route path='/lastdayspervenderdata' element={<LastDaysPerVenderData />} />
        {/* </Route> */}
      </Routes>
  );
}

export default App;
