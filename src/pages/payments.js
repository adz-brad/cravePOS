import React, { useState } from 'react';

const Payments = () => {


    const [ tabSelected, setTabSelected ] = useState('Tables');
    const [ tablesActive, setTablesActive ] = useState('payment-tab-active');
    const [ tabsActive, setTabsActive ] = useState('');
    const [ manualActive, setManualActive ] = useState('');

    const TypeSelect = () => {
        if(tabSelected === 'Tables'){
            setTablesActive('payment-tab-active');
            setTabsActive('');
            setManualActive('');
            return(
                <div className="w-full mt-1">
                    <h1 className="font-headers font-medium text-2xl mt-1 mx-1">Select Table</h1>
                    <select className="w-full border border-gray-900 font-content rounded-md p-2 my-1 text-xl">
                        <option disabled selected>Select a table...</option>
                    </select>
                    <h1 className="font-headers font-medium text-2xl mt-1 mx-1">Select Seat</h1>
                    <select className="w-full border border-gray-900 font-content rounded-md p-2 my-1 text-xl">
                        <option disabled selected>Select a seat...</option>
                    </select>
                </div>
            )
        }
        else if(tabSelected === 'Tabs'){
            setTablesActive('');
            setTabsActive('payment-tab-active');
            setManualActive('');
            return(
                <div className="w-full mt-1">
                    <h1 className="font-headers font-medium text-2xl mt-1 mx-1">Select Tab</h1>
                    <select className="w-full border border-gray-900 font-content rounded-md p-2 my-1 text-xl">
                        <option disabled selected>Select a tab...</option>
                    </select>
                </div>
            )
        }
        else if(tabSelected === 'Manual'){
            setTablesActive('');
            setTabsActive('');
            setManualActive('payment-tab-active');
            return(
                <div className="w-full mt-1">
                    <h1 className="font-headers font-medium text-2xl mt-1 mx-1">Select Item</h1>
                    <select className="w-full border border-gray-900 font-content rounded-md p-2 my-1 text-xl">
                        <option disabled selected>Select an item...</option>
                    </select>
                    <div className="flex flex-row items-center mt-1">
                        <h1 className="font-headers font-medium text-2xl mx-1">Quantity:</h1>
                        <input autofocus className="w-full border border-gray-900 font-content font-semibold rounded-md p-2 my-1 ml-3 text-xl text-center" type="number" placeholder="1"/>
                    </div>
                    <button className="w-full bg-gray-900 rounded-lg text-white font-headers font-medium text-2xl py-2 mt-2">Add To Order</button>
                </div>
            )
        }
    }

    return(
        <div className="top-0 left-0 flex flex-row w-full h-full">
            <div className="flex flex-col w-1/5 h-full">
                <div className="flex flex-col items-center">
                    <button onClick={()=> setTabSelected('Tables')} className={`payment-tab mb-1 ${tablesActive}`}>Open Tables</button>
                    <button onClick={()=> setTabSelected('Tabs')} className={`payment-tab my-1 ${tabsActive}`}>Open Tabs</button>
                    <button onClick={()=> setTabSelected('Manual')} className={`payment-tab my-1 ${manualActive}`}>Manual Entry</button>
                </div>
                <div className="flex flex-col">
                    <TypeSelect/>
                </div>
            </div>
            <div className="flex flex-row w-4/5">

            </div>
        </div>
    )
};

export default Payments

