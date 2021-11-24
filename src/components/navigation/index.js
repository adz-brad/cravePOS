import React from 'react'
import Clock from 'react-live-clock';


const Navigation = ({ children, className, logo, logout }) => {

    return(

        <nav id="navigation-overlay" className={className}>

            <div id="navigation-topbar" className="absolute top-0 left-0 flex flex-row items-center mr-5 shadow-lg bg-gray-900 text-white">
            
            {logo}

            <Clock
                className="font-headers text-lg absolute left-1/2 transform -translate-x-1/2"
                format={'dddd MMMM D, YYYY. h:mm:ss A'}
                ticking={true}  
            />

            {logout}

            </div>

            <div id="navigation-sidebar" className="absolute top-20 left-0 w-16 xxl:w-44 py-3 shadow-lg bg-gray-900">

                {children}

            </div>
            
        </nav>
    )
}

export default Navigation