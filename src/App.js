import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import NewVender from "./Components/NewVender";
import VenderTable from "./Components/VenderTable";
import SetRateFat from "./Components/SetRate_Fat";
import MilkEntry from "./Components/MilkEntry";
import AdminLogin from "./pages/AdminLogin";
// import Protected from './Components/Protected';
import VenderDetail from "./Components/VenderDetail";
import Payment from "./Components/Payment";
import VenderPaymentTable from "./Components/VenderPaymentTable";
import VenderAllEntries from "./Components/VenderAllEntries";
import OneDayMilkDetail from "./Components/OneDayMilkDetail";
import LastDaysDetailChart from "./Components/LastDaysDetailChart";
import LastDaysPerVenderData from "./Components/LastDaysPerVenderData";
import VenderMain from "./Components/VenderMain";
import DetailsChart from "./Components/DetailsChart";
import Header from "./Components/Header";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  document.title = "Dairy Management App";

  return (
    <>
      <header>
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          className="z-index-5 custom-header"
        />
      </header>
      <main className="bg-white dark:bg-black">
        <Routes>
          <Route path="/adminlogin" element={<AdminLogin />} />
          {/* <Route path='/forgetpassword' element={<ForgetPassword/>} /> */}
          {/* <Route element={<Protected />}> */}
          <Route path="/vender/payments/:id" element={<VenderPaymentTable />} />
          <Route path="/vendor" element={<VenderMain />} />
          <Route path="/vender/:id" element={<VenderDetail />} />
          <Route path="/vender/all/:id" element={<VenderAllEntries />} />
          <Route path="/" element={<MilkEntry />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/vendertable" element={<VenderTable />} />
          <Route path="/newvender" element={<NewVender />} />
          <Route path="/details" element={<DetailsChart />} />
          <Route path="/perdaydetail" element={<OneDayMilkDetail />} />
          <Route path="/updatedetail/:id" element={<SetRateFat />} />
          <Route
            path="/lastdaysdetailchart"
            element={<LastDaysDetailChart />}
          />
          <Route
            path="/lastdayspervenderdata"
            element={<LastDaysPerVenderData />}
          />
          {/* </Route> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
