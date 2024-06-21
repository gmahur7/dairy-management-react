import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';

const adminContext = createContext()

const AdminInfo = ({ children }) => {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState({})
    const [token, setToken] = useState()
    const [toPaymentIds, setToPaymentIds] = useState([])

    useEffect(() => {
        const handleAuthentication = () => {
          const data = JSON.parse(localStorage.getItem('admin')); 
          if (!data) {
            navigate('/adminlogin');
            return;
          }
      
          setAdmin(data);
      
          const  token  = data?.token;
          if (!token) {
            navigate('/adminlogin');
            return;
          }
      
          setToken(token);
      
          const isTokenExpired = () => {
            if (!token) return true;
      
            try {
              const decodedToken = jwtDecode(token);
              const currentTime = Date.now() / 1000;
              return decodedToken.exp < currentTime;
            } catch (error) {
              console.error('Error decoding token:', error);
              return true;
            }
          };
      
          if (isTokenExpired()) {
            navigate('/adminlogin');
          }
        };
      
        handleAuthentication();
      }, [navigate]);

    return (
        <adminContext.Provider value={{ admin, setAdmin, token, setToken,toPaymentIds, setToPaymentIds }}>{children}</adminContext.Provider>
    )
}

export const AdminState = () => {
    return useContext(adminContext)
}

export default AdminInfo;