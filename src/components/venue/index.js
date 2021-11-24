import React, { useContext, useState, useCallback, useEffect } from 'react';
import Context  from '../../context/createContext';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { useMutation } from '@apollo/client';
import { updateTablePosition, createTable } from '../../apollo/mutations';
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';
import { ImSpinner6 } from 'react-icons/im'
import { UpdateServiceOverlay, DeleteTableOverlay } from '../tables';
import { toast } from 'react-toastify';

const SectionLayout = ({ hideSourceOnDrag, section, className }) => {

    // TOASTS //

    const tableAddedToast= () => {
        toast("Table Added", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: false,
            progress: undefined,
            className: "custom-toast green-toast",
          });
      };

      const tableRemovedToast= () => {
        toast("Table Removed", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: false,
            progress: undefined,
            className: "custom-toast green-toast",
          });
      };

    // TABLE DATA //

    const context = useContext(Context);
    const tableList = context.tables;
    const user = context.user;
    const [ tables, setTables ] = useState(tableList);
    const sectionTables = tables.filter((table) => table.section === section);
    const [ tableAdded, setTableAdded ] = useState(false);
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ newTableNumber, setNewTableNumber ] = useState(1);
    
    let server;
    if(user != null){
        server = user.username;
    };

    const tableNumbers = Array.from(sectionTables.map(table => table.tableNumber));

    var tableIndex = tableNumbers.findIndex(x => x == newTableNumber); 

    if(tableIndex !== -1){
        setNewTableNumber(newTableNumber + 1);
    }

    useEffect(() => {
        setNewTableNumber(1);
    }, [ tables, section ]);

    if(context.tables.filter((table) => table.section === section).length === sectionTables.length + 1 ){
        setTables(context.tables);
        if (tableAdded === true){
            setTableLoading(false);
            tableAddedToast();
        };
    };

    if(context.tables.filter((table) => table.section === section).length === sectionTables.length - 1 ){
        setTables(context.tables);
        tableRemovedToast();
    };


    // MOVE TABLE //

    const [ moveTablePosition ] = useMutation(updateTablePosition);

    const moveTable = useCallback((id, left, top) => {
        moveTablePosition({variables: { tableID: String(id), layoutPositionX: parseFloat(left), layoutPositionY: parseFloat(top) }});      
        const tableIndex = tables.findIndex(x => x.tableID === id);
        setTables(update(tables, {
            [tableIndex]: {
                $merge: { layoutPositionX: left , layoutPositionY: top }
            },
        }));
    }, [ tables ]);

    const ItemTypes = {
        TABLE: 'table'
    };

    const [, drop ] = useDrop(() => ({
        accept: ItemTypes.TABLE,
        drop(item, monitor) {
            const viewportWidth = document.getElementById("layout").offsetWidth;
            const viewportHeight = document.getElementById("layout").offsetHeight;        
            const convertXtoPx = (item.left/100) * viewportWidth;
            const convertYtoPx = (item.top/100) * viewportHeight;
            const delta = monitor.getDifferenceFromInitialOffset();  
            const deltaX = Math.round(convertXtoPx + delta.x);
            const deltaY = Math.round(convertYtoPx + delta.y);     
            const left = (deltaX / viewportWidth) * 100;
            const top = (deltaY / viewportHeight) * 100;
            moveTable(item.id, left, top);
            return undefined;
        },
    }), [ moveTable ]);


    // NEW TABLE //

    const newTableSection = section;
    const newTableID = String(`Table-${newTableNumber}-${section}-${Math.floor(Math.random() * 10000000000)}`).replace(/\s+/g, '');
    const newTableLayoutPosX = 86;
    const newTableLayoutPosY = 62;
    const newTableService = {
        "currentServer": server,
        "seats": []
    };

    const [ newTable ] = useMutation(createTable, {
        variables: { 
            tableID: String(newTableID), 
            section: String(newTableSection),
            tableNumber: parseInt(newTableNumber),
            layoutPositionX: parseFloat(newTableLayoutPosX),
            layoutPositionY: parseFloat(newTableLayoutPosY),
            service: newTableService,
         }
    });

    const addTable = async() => {
        setTableLoading(true);
        await newTable();
        setTableAdded(true);
    };


    // DELETE TABLE //

    const [ deleteTableID, setDeleteTableID ] = useState(null);
    const [ deleteTableNumber, setDeleteTableNumber ] = useState(null);
    const [ deleteTableSection, setDeleteTableSection ] = useState(null);
    const [ deleteTableOverlay, setDeleteTableOverlay ] = useState(false);

    const removeTable = (tableID, tableNumber, section) => {
        setDeleteTableID(tableID);
        setDeleteTableNumber(tableNumber);
        setDeleteTableSection(section);
        setDeleteTableOverlay(true);
    };

    // UPDATE SERVICE //

    const [ updateServiceTableID, setUpdateServiceTableID ] = useState(null);
    const [ updateServiceTableNumber, setUpdateServiceTableNumber ] = useState(null);
    const [ updateServiceTableSection, setUpdateServiceTableSection ] = useState(null);
    const [updateServiceOverlay, setUpdateServiceOverlay] = useState(false);

    const updateTableService = (tableID, tableNumber, section) => {
        setUpdateServiceTableID(tableID);
        setUpdateServiceTableNumber(tableNumber);
        setUpdateServiceTableSection(section);
        setUpdateServiceOverlay(true);
    };

    // TABLE //

    const Table = ({ id, left, top, title, tableID, className, hideSourceOnDrag, children }) => {
        

        const [{ isDragging }, drag ] = useDrag(() => ({
            type: ItemTypes.TABLE,
            item: { id, left, top, tableID, title },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }), [ id, left, top, tableID, title ]);
        if (isDragging && hideSourceOnDrag) {
            return <div ref={drag} />;
        }
        return(
            <div ref={drag} className={`absolute table-size cursor-move bg-gray-200 border-2 shadow-md rounded-2xl text-xl font-semibold flex flex-col items-center justify-center ${className}`} style={{ left: `${left}%`, top: `${top}%` }} role="Table">
                {children}
            </div>
        )
    };

    return(
        <div id="layout" ref={drop} className={`relative ${className}`}>
            
            <UpdateServiceOverlay tableID={updateServiceTableID} tableNumber={updateServiceTableNumber} section={updateServiceTableSection} active={updateServiceOverlay} close={() => (setUpdateServiceOverlay(false))}/>
            <DeleteTableOverlay tableID={deleteTableID} tableNumber={deleteTableNumber} section={deleteTableSection} active={deleteTableOverlay} close={() => (setDeleteTableOverlay(false))} />

            {Object.keys(sectionTables).map((key) => {

                const { layoutPositionX, layoutPositionY, tableID, tableNumber, section } = sectionTables[key];
          
                const tableData = context.tables.filter((table) => table.tableID === tableID);
                
                const iterator = ({array}) => {
                    let iterator = array.values();
                    for (let elements of iterator) {   
                      return elements;   
                    };
                  };

                const table = iterator({ array: tableData});
                
                let tableStatus;
                if(table != undefined){
                    if(table.service != null){
                        if(table.service.seats.length >= 1){
                            tableStatus = 'Active'
                        }
                        if(table.service.seats.length === 0){
                            tableStatus = 'Available'
                        }
                    }
                }
   
                return (
                    <Table className={`${tableStatus === 'Active' ? 'border-red-600' : 'border-green-600'}`} key={key} title={tableNumber} tableID={tableID} id={tableID} left={layoutPositionX} top={layoutPositionY} hideSourceOnDrag={hideSourceOnDrag}>
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center whitespace-nowrap select-none w-full h-0">
                            { tableStatus === 'Active' ?
                                null
                            :
                                <BiMinusCircle onClick={() => (removeTable(tableID, tableNumber, section))}className="absolute top-0 right-1 text-xl text-red-600 cursor-pointer"/>
                            }
                            <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 font-headers text-xl h-0">{tableNumber}</h1>
                            <div className="hidden xxl:block absolute top-7 left-1/2 transform -translate-x-1/2 flex flex-row items-center h-0 select-none whitespace-nowrap">
                                { tableStatus === 'Active' ?
                                    <span className="font-content font-bold text-lg h-0 select-none whitespace-nowrap"></span>
                                :
                                    null
                                }
                            </div>
                            <div className="hidden xxl:block  absolute top-12 left-1/2 transform -translate-x-1/2 flex flex-row items-center h-0 select-none whitespace-nowrap">
                                { tableStatus === 'Active' ?
                                    <span className="font-content font-bold text-lg h-0 select-none whitespace-nowrap text-red-600">Occupied</span>
                                :
                                    <span className="font-content font-bold text-lg h-0 select-none whitespace-nowrap text-green-600">Available</span> 
                                }
                            </div>
                        </div>
                        { tableStatus === 'Active' ?
                            <button className="w-11/12 absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-600 hover:bg-green-600 text-white font-bold text-lg font-content pt-1 pb-2 rounded-b-xl rounded-t-sm" onClick={()=> (updateTableService(tableID, tableNumber, section))}>Open</button>                 
                        :              
                            <button className="w-11/12 absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-600 hover:bg-green-600 text-white font-bold text-lg font-content pt-1 pb-2 rounded-b-xl rounded-t-sm" onClick={()=> (updateTableService(tableID, tableNumber, section))}>Start</button>           
                        }
                    </Table>
                )
            })}


            { tableLoading === false ?

                <button id="addTableButton" onClick={()=> (addTable())} className="absolute bottom-2 right-2 flex flex-row items-center cursor-pointer p-1">
                    <BiPlusCircle className="text-4xl text-green-600"/><span className="mx-2 mb-1 text-2xl font-semibold font-headers">Add Table</span>
                </button>

            :
        
                <ImSpinner6 className="absolute bottom-2 right-2 text-gray-900 text-3xl filter drop-shadow-md loading m-1"/>

            }


        </div>
    )
};

export { SectionLayout };