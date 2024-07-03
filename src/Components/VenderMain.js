import React, { Fragment } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { Button } from 'react-bootstrap'

const VenderMain = () => {
    const naviagte = useNavigate()
    return (
        <Fragment>
            <div className='container-fluid bg-main text-light d-flex justify-items-center align-items-center'>
                <div className='flex-grow-1 overflow-auto pt-0 pt-sm-0'>
                    <div className='container'>
                        <div className="row justify-content-center g-3 g-sm-5 sm:px-5">
                            <div className="col-12 col-sm-6">
                                <div className='d-flex flex-column align-items-center border border-2 border-secondary py-5 rounded-4'>
                                    <h2 className='text-info'>New Vendor</h2>
                                    <p className='text-center'>Add a new vendor to your list of sellers.</p>
                                    <Button variant='primary' className='btn-main rounded-2 px-3 py-2' onClick={() => naviagte('/newvender')}>Add Vender</Button>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6  ">
                                <div className='d-flex flex-column align-items-center border border-2 border-secondary py-5 rounded-4'>
                                    <h2 className='text-info'>All Vender Table</h2>
                                    <p className='text-center'>View all the vendors in one place and manage them easily.</p>
                                    <Button className='btn-main rounded-2 px-3 py-2' onClick={() => naviagte('/vendertable')}>Vender Table</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default VenderMain