import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChair } from 'react-icons/fa';
import { GiTable } from 'react-icons/gi';
import { BiCaretLeft , BiTransfer, BiPlusCircle, BiPencil, BiXCircle, BiCircle } from 'react-icons/bi';
import { IoFastFoodSharp } from 'react-icons/io5';

const BackLink = ({ linkTo, linkName }) => {
    return(
        <Link className="absolute bottom-1 right-5 backlink flex flex-row items-center" to={linkTo}>
            <BiCaretLeft className="text-6xl"/><span className="text-4xl font-headers pb-1 filter drop-shadow-lg">Back to {linkName}</span>
        </Link>
    )
}

const LinkButton = ({ linkTo, linkIcon, linkName, className }) => {
    return(
        <Link className={`flex flex-col items-center justify-center bg-white shadow-md rounded-xl m-1 transform hover:scale-105 ${className}`} to={linkTo}>
            {linkIcon}
            <span className="font-headers text-3xl font-semibold">{linkName}</span>
        </Link>
    )
};

const ToggleButton = ({ onClick, className, toggleIcon, toggleName }) => {
    return(
        <button onClick={onClick} className={`flex flex-col items-center justify-center bg-white shadow-md rounded-xl m-1 transform hover:scale-105 ${className}`}>
            {toggleIcon}
            <span className="font-headers text-3xl font-semibold">{toggleName}</span>
        </button>
    )
};

const NewTableIcon = () => {
    return(
        <div className="relative mb-3">
            <GiTable className="text-7xl"/>
            <BiPlusCircle className="absolute top-1 -left-4 text-3xl" />
        </div>
    )
};

const ModifyTableIcon = () => {
    return(
        <div className="relative mb-3">
            <GiTable className="text-7xl"/>
            <div className="absolute top-5 left-0">
                <BiCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl"/>
                <BiPencil className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg" />
            </div>     
        </div>
    )
};

const TransferTableIcon = () => {
    return(
        <div className="relative mb-3">
            <GiTable className="text-7xl"/>
            <div className="absolute top-5 left-0">
                <BiCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl"/>
                <BiTransfer className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg" />
            </div> 
        </div>
    )
};

const CloseTableIcon = () => {
    return(
        <div className="relative mb-3">
            <GiTable className="text-7xl"/>
            <BiXCircle className="absolute top-1 -left-4 text-3xl" />
        </div>
    )
};

const NewSeatIcon = () => {
    return(
        <div className="relative mb-3">
            <FaChair className="text-5xl"/>
            <BiPlusCircle className="absolute -top-6 -left-5 text-3xl" />
        </div>
    )
};

const ModifySeatIcon = () => {
    return(
        <div className="relative mb-3">
            <FaChair className="text-5xl"/>
            <div className="absolute -top-3 left-0">
                <BiCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl"/>
                <BiPencil className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg" />
            </div>  
        </div>
    )
};

const TransferSeatIcon = () => {
    return(
        <div className="relative mb-3">
            <FaChair className="text-5xl"/>
            <div className="absolute -top-3 left-0">
                <BiCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl"/>
                <BiTransfer className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg" />
            </div>  
        </div>
    )
};

const CloseSeatIcon = () => {
    return(
        <div className="relative mb-3">
            <FaChair className="text-5xl"/>
            <BiXCircle className="absolute -top-6 -left-5 text-3xl" />
        </div>
    )
};

const NewOrderIcon = () => {
    return(
        <div className="relative mb-3">
            <IoFastFoodSharp className="text-5xl"/>
            <BiPlusCircle className="absolute -top-4 -left-5 text-3xl" />
        </div>
    )
};

const ModifyOrderIcon = () => {
    return(
        <div className="relative mb-3">
            <IoFastFoodSharp className="text-5xl"/>
            <div className="absolute -top-1 left-0">
                <BiCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl"/>
                <BiTransfer className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg" />
            </div>  
        </div>
    )
};

const CancelOrderIcon = () => {
    return(
        <div className="relative mb-3">
            <IoFastFoodSharp className="text-5xl"/>
            <BiXCircle className="absolute -top-4 -left-5 text-3xl" />
        </div>
    )
};

const CloseButton = ({ onClick, closeButtonClass }) => {
    return(
        <BiXCircle onClick={onClick} className={`absolute cursor-pointer z-50 ${closeButtonClass}`} />
    )
}

const Overlay = ({ children, className, onClose, closeButtonClass, auxiliaryButtons  }) => {

    const [ overlayWidth, setOverlayWidth ] = useState(document.getElementById("display").offsetWidth);
    const [ overlayHeight, setOverlayHeight ] = useState(document.getElementById("display").offsetHeight);
    
    window.addEventListener('resize', function(){
        setOverlayWidth(document.getElementById("display").offsetWidth);
        setOverlayHeight(document.getElementById("display").offsetHeight);
      });

    return(
        <div className={`fixed bottom-4 right-4 bg-white z-50 ${className}`} style={{width: overlayWidth, height: overlayHeight}}>
            {auxiliaryButtons}
            <CloseButton closeButtonClass={closeButtonClass} onClick={onClose} />
            {children}
        </div>
    )
};

const Popup = ({ children, className }) => {
    return(

        <div className={`${className}`}>
            {children}
        </div>
    )
};

export { 
    BackLink, 
    LinkButton,
    ToggleButton,
    NewSeatIcon,
    ModifySeatIcon,
    TransferSeatIcon,
    CloseSeatIcon,
    NewTableIcon,
    ModifyTableIcon,
    TransferTableIcon,
    CloseTableIcon,
    NewOrderIcon,
    ModifyOrderIcon,
    CancelOrderIcon,
    Overlay,
    Popup
}