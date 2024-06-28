import React, { useState } from 'react'
import { LuMilk } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { RiMenuUnfold4Line2 } from "react-icons/ri";
import { Button } from 'react-bootstrap';
import { FaRegWindowClose } from "react-icons/fa";


const Header = () => {

    const [mobileNav, setMobileNav] = useState(false);

    return (
        <>
            <header className='container-fluid  py-3 py-sm-5 bg-main'>
                <div className='row justify-content-between align-items-center px-0 px-md-5'>
                    <div className='col-6'>
                        <h4 className=' text-main'>Dairy Management
                            <span className='fs-3 text-white'><LuMilk /></span>
                        </h4>
                    </div>
                    <div className='col-6 d-none d-sm-block'>
                        <ul className='d-flex justify-content-end gap-2 gap-sm-3 gap-md-4 list-unstyled fs-10'>
                            <li className='text-decoration-none' style={{ textDecoration: 'none' }}><Link to='/#'>Home</Link></li>
                            <li className='text-decoration-none'><Link to='/vendor'>Vendor</Link></li>
                            <li className='text-decoration-none'><Link to='/details'>Details</Link></li>
                            <li className='text-decoration-none'><Link to='/#'>About</Link></li>
                            <li className='text-decoration-none'><Link to='/#'>Logout</Link></li>
                        </ul>
                    </div>
                    <div className='col-6  d-sm-none'>
                        <div className='text-end'>
                            <Button onClick={() => setMobileNav(!mobileNav)} className='bg-sec'>
                                <RiMenuUnfold4Line2 className='text-white fs-1' />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            {
                mobileNav && <MobileNav close={setMobileNav} value={mobileNav} />
            }
        </>
    )
}

export default Header

export const MobileNav = ({close,value}) => {
    
    return (
        <div className='min-vh-100 min-w-75 z-index-5 bg-sec position-absolute end-0 top-0 py-3 px-5'>
                <div className='row justify-content-between align-items-center mb-5'>
                    <div className='col-8 text-start'>
                        <h4 className=' text-main'>Dairy
                            <span className='fs-1 text-white'><LuMilk /></span>
                        </h4>
                    </div>
                    <div className='col-4 text-end'>
                        <button onClick={()=>close(!value)} className='text-main bg-sec'>
                            <FaRegWindowClose className='fs-1  text-main'/>
                        </button>
                    </div>
                </div>
                <div className='row justify-content-center align-items-center flex-column'>
                    <div className='col-6 text-center'>
                        <ul className='d-flex justify-content-end flex-column gap-3 list-unstyled fs-10'>
                            <li className='text-decoration-none' style={{ textDecoration: 'none' }}><Link to='/#'>Home</Link></li>
                            <li className='text-decoration-none'><Link to='/vendor'>Vendor</Link></li>
                            <li className='text-decoration-none'><Link to='/details'>Details</Link></li>
                            <li className='text-decoration-none'><Link to='/#'>About</Link></li>
                            <li className='text-decoration-none'><Link to='/#'>Logout</Link></li>
                        </ul>
                    </div>
                </div>
        </div>
    )
}
