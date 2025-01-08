import React, { useEffect, useState } from 'react'
import Api_Url from '../env'
import { AdminState } from '../Context/ContextApi'
import { Link } from 'react-router-dom'
import { GrUpdate } from 'react-icons/gr'

const VenderTable = () => {
    const { token } = AdminState()
    const [data, setData] = useState([])

    const getData = async () => {
        let result = await fetch(`${Api_Url}/api/vender`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        result = await result.json()
        if (result.length > 0) setData(result)
    }

    useEffect(() => {
        getData()
    }, [token])

    return (
        <div className='container-fluid bg-main text-white'>
            <div className='container d-flex flex-column align-items-center gap-2'>
                <div>
                    <h2 className='text-info'>All Vendors</h2>
                </div>
                <div>
                    <button variant='secondary'><Link className='text-white text-decoration-none' to='/lastdayspervenderdata'>Last Days Per Vender Data</Link></button>
                </div>
                <div className='col-12 col-sm-6 mt-4 rounded-3'>
                    {
                        data.length > 0 &&
                        <table variant='dark' striped bordered hover size="lg" style={{ padding: "10px", textAlign: "center" }}>
                            <thead  >
                                <tr>
                                    <th>S.No</th>
                                    <th>Vender Name</th>
                                    <th>FatPass</th>
                                    <th>Rate</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><Link to={`/vender/${item._id}`} className='vendor-name-link'>{item.Name}</Link></td>
                                            <td>{item.FatPass}</td>
                                            <td>{item.Rate}</td>
                                            <td title={`Update ${item.Name} Details`} ><Link to={`/updatedetail/${item._id}`} style={{ color: "yellow" }} className='vendor-name-link'><GrUpdate /></Link></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default VenderTable