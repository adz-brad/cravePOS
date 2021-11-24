import React, { useContext } from 'react';
import Context  from '../context/createContext';
import { useMutation } from "@apollo/client";
import { updateSeatOrder } from '../apollo/mutations';
import { toast } from 'react-toastify';

const orderUpdated= () => {
    toast("Order Updated", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };


const Orders = () => {

    const context = useContext(Context);
    const tableData = context.tables;

    const iterator = ({array}) => {
        let iterator = array.values();
        for (let elements of iterator) {   
          return elements;   
        };
      };

    const seats = iterator({ array: tableData.map(table => table.service.seats.filter((seat) => seat.orders.length > 0))});

    let ordersInQueue;
    if(seats != undefined){
        ordersInQueue = seats.map(seat => seat.orders.filter((order) => order.orderStatus === 'Sent'));
    }
    else{
        ordersInQueue = [];
    }
    
    const ordersInQueueList = [].concat(...ordersInQueue.map((order) => {
        return order
    }));

    let ordersInProgress;
    if(seats != undefined){
        ordersInProgress = seats.map(seat => seat.orders.filter((order) => order.orderStatus === 'In Progress'));
    }
    else{
        ordersInProgress = [];
    }

    const ordersInProgressList = [].concat(...ordersInProgress.map((order) => {
        return order
    }));

    const [ updateOrder ] = useMutation(updateSeatOrder);

    const updateOrderStatus = async (order, status) => {
        const orderObject = { orderStatus: String(status) };
        await updateOrder({ variables: {tableID: String(order.tableID), seatID: String(order.seatID), orderID: String(order.orderID), orders: orderObject }})
        orderUpdated();
    };

    return(

        <div className="flex flex-col rounded-t-lg h-full">
            <div className="flex flex-row items-center bg-gray-900 rounded-t-lg h-12">
                <h1 className="font-headers text-2xl text-white ml-2">Orders</h1>
            </div>
            <div className="flex flex-row items-center pt-1 h-full">
                <div className="flex flex-col w-1/2 h-full mr-1">
                    <div className="flex flex-row items-center bg-gray-900 rounded-t-sm h-10">
                        <h1 className="font-headers text-xl text-white p-1 ml-1">In Queue</h1>
                    </div>
                    <div className="flex flex-col h-full border-2 rounded-bl-lg">
                        {ordersInQueueList.map((order) => {
                            return(
                                <div className="flex flex-row items-center rounded-sm mt-1 shadow-md">
                                    <h1 className="font-content font-semibold text-xl ml-1">
                                        {order.orderID}
                                    </h1>
                                    <button className="my-1 px-3 py-1 ml-auto mr-2 rounded-md bg-green-600 text-white font-headers text-xl" onClick={()=> updateOrderStatus(order, 'In Progress')}>
                                        Start
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-1/2 h-full ml-1">
                    <div className="flex flex-row items-center bg-gray-800 rounded-t-sm h-10">
                        <h1 className="font-headers text-xl text-white p-1 ml-1">In Progress</h1>
                    </div>
                    <div className="flex flex-col h-full border-2 rounded-br-lg">
                        {ordersInProgressList.map((order) => {
                            return(
                                <div className="flex flex-row items-center rounded-sm mt-1 shadow-md">
                                    <h1 className="font-content font-semibold text-xl ml-1">
                                        {order.orderID}
                                    </h1>
                                    <button className="my-1 px-3 py-1 ml-auto mr-2 rounded-md bg-green-600 text-white font-headers text-xl" onClick={()=> updateOrderStatus(order, 'Ready')}>
                                        Ready
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

    )
};

export default Orders