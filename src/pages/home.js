import React, { useContext } from 'react';
import Context  from '../context/createContext';
import { LinkButton } from '../components/widgets';
import { IoFastFoodSharp } from 'react-icons/io5';
import { FaTablets, FaChair } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import { GiTakeMyMoney, GiReceiveMoney } from 'react-icons/gi'

const Home = () => {

    const context = useContext(Context);
    const user = context.user;

    return(
        <div className="w-full h-full grid grid-cols-3 gap-1">
            <LinkButton linkTo="/guests" linkIcon={<FaTablets className="text-6xl mb-3"/>} linkName="Open Table" className="" />
            <LinkButton linkTo="/" linkIcon={<FaChair className="text-6xl mb-3"/>} linkName="Add Guest" className="" />
            <LinkButton linkTo="/" linkIcon={<IoFastFoodSharp className="text-6xl mb-3"/>} linkName="Create Order" className="" />
            <LinkButton linkTo="/" linkIcon={<GiReceiveMoney className="text-6xl mb-3"/>} linkName="Take Payment" className="" />
            <LinkButton linkTo="/" linkIcon={<BiTransfer className="text-6xl mb-3"/>} linkName="Order Status" className="" />
            <LinkButton linkTo="/" linkIcon={<GiTakeMyMoney className="text-6xl mb-3"/>} linkName="Cash Out" className="" />
        </div>
    )
};

export default Home

