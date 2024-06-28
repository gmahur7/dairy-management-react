import React from 'react'
import { LuMilk } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { RiMenuUnfold4Line2 } from "react-icons/ri";


const Header = () => {
    return (
        <header className='container-fluid py-3'>
                <div className='row justify-content-between px-0 px-md-5'>
                    <div className='col-6'>
                        <h4 className=' text-main'>Dairy Management
                            <span className='fs-3 text-white'><LuMilk/></span>
                        </h4>
                    </div>
                    <div className='col-6 d-none d-sm-block'>
                            <ul className='d-flex justify-content-end gap-2 gap-sm-3 gap-md-4 list-unstyled fs-10'>
                                <li className='text-decoration-none' style={{ textDecoration: 'none' }}><Link to='/#'>Home</Link></li>
                                <li className='text-decoration-none'><Link to='/#'>Vendor</Link></li>
                                <li className='text-decoration-none'><Link to='/#'>Details</Link></li>
                                <li className='text-decoration-none'><Link to='/#'>About</Link></li>
                                <li className='text-decoration-none'><Link to='/#'>Logout</Link></li>
                            </ul>
                    </div>
                    <div className='col-6  d-sm-none'>
                        <div className='text-end'>
                            <RiMenuUnfold4Line2 className='text-white fs-1'/>
                        </div>
                    </div>
                </div>
        </header>
    )
}

export default Header