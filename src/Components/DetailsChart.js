import React from 'react'
import { useNavigate } from 'react-router-dom'

const DetailsChart = () => {
    const navigate = useNavigate()
    return (
        <div className='container-fluid h-full bg-main text-white'>
            <div className='container py-5'>
                <div className='row gx-3'>
                    <div className='col-12 col-md-4  rounded border-2 border border-info p-4 text-center'>
                        <h3 className='fs-3 text-main'>Last Days Milk Data</h3>
                        <p className='py-2'>Get insights into the performance of milk vendors over the last 7 days. This section provides an overview of milk sales, delivery volumes, and customer satisfaction ratings. Analyzing trends over the past week helps in understanding demand fluctuations and optimizing supply chain logistics for fresher milk.</p>
                        <button className='bg-secondary border-secondary' onClick={() => navigate('/lastdaysdetailchart')}>View Details</button>
                    </div>
                    <div className='col-12 col-md-4 rounded border-2 border border-info p-4 text-center'>
                        <h3 className='fs-3 text-main'>One Day Data</h3>
                        <p>Dive into detailed data from a single day's operations of milk vendors. This snapshot offers a close examination of milk delivery routes, quality control measures, and customer feedback for a specific date. Monitoring daily operations ensures that our dairy products meet the highest standards of freshness and quality.</p>
                        <button className='bg-secondary border-secondary' onClick={() => navigate('/perdaydetail')}>View Details</button>
                    </div>
                    <div className='col-12 col-md-4  rounded border-2 border border-info p-4 text-center'>
                        <h3 className='fs-3 text-main'>Last Days Per Vendor Data</h3>
                        <p>Explore the performance of individual milk vendors over the past few days. This section breaks down milk sales, delivery accuracy, and customer retention rates by vendor. Understanding each vendor's contribution allows us to maintain strong partnerships, ensure consistent product availability, and deliver the finest quality milk to our customers.</p>
                        <button className='bg-secondary border-secondary' onClick={() => navigate('/lastdayspervenderdata')}>View Details</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailsChart