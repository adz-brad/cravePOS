import React, { useState, useContext, useEffect } from "react";
import Context  from '../../context/createContext';
import { useMutation } from "@apollo/client";
import { deleteTable, createSeat, deleteSeat, createSeatOrder, updateSeatOrder, deleteSeatOrder, deleteSeatOrderItem } from '../../apollo/mutations';
import update from 'immutability-helper';
import { Overlay } from '../widgets';
import { FaCog, FaUserPlus, FaDollarSign, FaHistory, FaTrashAlt, FaSave, FaUserNurse, FaEdit, FaConciergeBell, FaClipboardList } from 'react-icons/fa';
import { IoFastFoodSharp, IoFishSharp } from 'react-icons/io5';
import { BiTransfer, BiMinusCircle, BiCaretLeftCircle, BiPlusCircle, BiRefresh, BiXCircle } from 'react-icons/bi';
import { GiCoconuts, GiPeanut, GiSadCrab, GiWheat, GiPeas, GiRawEgg, GiMilkCarton, GiCook } from "react-icons/gi";
import { RiSendPlaneFill, RiSwapLine } from "react-icons/ri";
import { ImSpinner6 } from 'react-icons/im';
import { toast } from 'react-toastify';


const seatAddedToast= () => {
    toast("Seat Added", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const seatRemovedToast= () => {
    toast("Seat Removed", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const orderClearedToast= () => {
    toast("Order Cleared", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const noOrderItemsToast= () => {
    toast("No Order Items To Submit", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast red-toast",
      });
  };

  const orderSentToast= () => {
    toast("Order Sent", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const orderSavedToast= () => {
    toast("Order Saved", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const noOrdersToast = () => {
    toast("No Orders To Send", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast red-toast",
      });
  };

  const itemAlreadyRemoved = () => {
    toast("Item Already Removed", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast red-toast",
      });
  };

  const itemRemoved = () => {
    toast("Item Removed", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const orderRemoved = () => {
    toast("Order Removed", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };


const SeatDisplay = ({ displayType, tableID, tableNumber, section, seatID, seats, children }) => {

    const context = useContext(Context);
    const menus = context.menu;
    let seatData;
    if( seats != undefined && seats != null){
        seatData = Array.from(seats.filter((seat) => seat.seatID === seatID))
    }

    const iterator = ({array}) => {
        let iterator = array.values();
        for (let elements of iterator) {   
          return elements;   
        };
      };

    const seat = iterator({ array: seatData});
    const initialMenu = iterator({ array: menus});

    let scrollWrapperHeight;
    if(document.getElementById("order-display") != null){
        scrollWrapperHeight = document.getElementById("order-display").offsetHeight
    }

    const [ menuTabSelected, setMenuTabSelected ] = useState(initialMenu);

    let categories;
    if(menuTabSelected != null && menuTabSelected != undefined) {
        categories = menuTabSelected.categories.map((category) => category)
    }
    
    const initialCategory = iterator({ array: categories});
    const [ categoryTabSelected, setCategoryTabSelected ] = useState(initialCategory);

    useEffect(() => {
        setCategoryTabSelected(initialCategory);
    },[menuTabSelected]);

    let menuItems;
    if(categoryTabSelected != null && categoryTabSelected != undefined){
        menuItems = categoryTabSelected.menuItems.map((menuItem) => menuItem);
    }

    const [ seatOrderList, setSeatOrderList ] = useState([]);
    
    useEffect(() => {
        setSeatOrderList([]);
    }, [ displayType ]);

    const addToOrder = (menuItem) => {
        let sides;
        if(menuItem.sides != undefined){
            sides = menuItem.sides.map((side) => { return { name: side.name } });
        }
        else{
            sides = [];
        }
        let subs;
        if(menuItem.subs != undefined){
            subs = menuItem.subs.map((sub) => { return { name: `${sub.type} ${sub.name} ${sub.quantity > 0 ? `x ${sub.quantity}`: ''}`}});
        }
        else{
            subs = [];
        }
        const orderItemIndex = seatOrderList.findIndex(x => x.orderItemID);
        let orderItem;
        if(orderItemIndex !== -1){
            const iterator = ({array}) => {
                let iterator = array.values();
                for (let elements of iterator) {   
                  return elements;   
                };
              };
            orderItem = seatOrderList.filter((orderItem) => orderItem.orderItemID === menuItem.menuItemID);
            const orderData = iterator({ array: orderItem});
            if(orderData.modified === 'true'){
                orderItem = {
                    "orderItemID": menuItem.menuItemID,
                    "name": menuItem.name,
                    "price": menuItem.price,
                    "ingredients": menuItem.ingredients,
                    "quantity": 1,
                    "sides": sides,
                    "subs": subs,
                    "notes": orderItemNotes,
                    "modified": menuItem.modified
                };
                const existingSeatOrderList = seatOrderList;
                const updatedSeatOrderList = existingSeatOrderList.concat(orderItem);
                setSeatOrderList(updatedSeatOrderList);
            }
            else{
                if(menuItem.modified === 'true'){
                    orderItem = {
                        "orderItemID": menuItem.menuItemID,
                        "name": menuItem.name,
                        "price": menuItem.price,
                        "ingredients": menuItem.ingredients,
                        "quantity": 1,
                        "sides": sides,
                        "subs": subs,
                        "notes": orderItemNotes,
                        "modified": menuItem.modified
                    };
                    const existingSeatOrderList = seatOrderList;
                    const updatedSeatOrderList = existingSeatOrderList.concat(orderItem);
                    setSeatOrderList(updatedSeatOrderList);
                }
                else{
                    const updatedQuantity = parseInt(orderData.quantity + 1) ;
                    const updatedPrice = Number(parseFloat(menuItem.price * updatedQuantity).toFixed(2));
                    setSeatOrderList(update(seatOrderList, {
                        [orderItemIndex]: {
                            $merge: { quantity: updatedQuantity, price: updatedPrice }
                        },
                    }));
                }
            }
        }
        else{
            const ingredients = menuItem.ingredients.map((ingredient) => {
                return { type: 'Base', ingredientID: ingredient.ingredientID, name: ingredient.name, inventoryQuantity: ingredient.quantity }
            });
            orderItem = {
                "orderItemID": menuItem.menuItemID,
                "name": menuItem.name,
                "price": menuItem.price,
                "ingredients": ingredients,
                "quantity": 1,
                "sides": sides,
                "subs": subs,
                "notes": orderItemNotes,
                "modified": menuItem.modified
            };
            const existingSeatOrderList = seatOrderList;
            const updatedSeatOrderList = existingSeatOrderList.concat(orderItem);
            setSeatOrderList(updatedSeatOrderList);
        }
        if(modifierOverlayOpen === true){
            setModifierOverlayOpen(false);
            setOrderItemNotes(null);
        }
    };

    const removeFromOrder = (orderItem, index) => {
        const orderItemIndex = seatOrderList.findIndex(x => x.orderItemID === orderItem.orderItemID);
        if(orderItem.quantity > 1){
            const updatedQuantity = parseInt(orderItem.quantity -1);
            const updatedPrice = Number(parseFloat(orderItem.price - (orderItem.price / orderItem.quantity)).toFixed(2));
            setSeatOrderList(update(seatOrderList, {
                [orderItemIndex]: {
                    $merge: { quantity: updatedQuantity, price: updatedPrice }
                },
            }));
        }
        else{
            setSeatOrderList(update(seatOrderList, {
                $splice: [[index, 1]]
            }));
        }
    };


    function addPrices(a){
        var total=0;
        for(var i in a) {
            total += a[i];
        }
        return total;
    }

    const prices = seatOrderList.map((orderItem) => (
        parseFloat(orderItem.price)
    ));

    let orderTotal;
    if(seatOrderList.length >= 1){
        orderTotal = parseFloat(addPrices(prices)).toFixed(2);
    }
    else{
        orderTotal = parseFloat(0).toFixed(2);
    }

    const clearOrder = () => {
        setSeatOrderList([]);
        orderClearedToast();
    };

    const [ createOrder ] = useMutation(createSeatOrder); 

    const saveOrder = async (seatNumber) => {
        if(seatOrderList.length >= 1){
            const newSeatOrderID = String(`Order:Seat${seatNumber}-Table${tableNumber}-${section}-${Math.floor(Math.random() * 10000000000)}`).replace(/\s+/g, '');
            console.log(seatOrderList);
            const order = { orderID: newSeatOrderID, orderStatus: "Saved", orderItems: seatOrderList };
            await createOrder({ variables: { tableID: String(tableID), seatID: String(seatID), orders: order }});
            orderSavedToast();
            setSeatOrderList([]);
        }
        else{
            noOrderItemsToast();
        }
    };

    const modifiers = [
        { name: "Sides" },
        { name: "Modifiers" },
        { name: "Notes" },
        { name: "Item Data"},
    ];

    const allergies = [
        { name: "Wheat", icon: <GiWheat className="my-auto text-white text-5xl"/> },
        { name: "Egg", icon: <GiRawEgg className="my-auto text-white text-5xl"/> },
        { name: "Dairy", icon: <GiMilkCarton className="my-auto text-white text-5xl"/> },
        { name: "Soy", icon: <GiPeas className="my-auto text-white text-5xl"/> },
        { name: "Fish", icon: <IoFishSharp className="my-auto text-white text-5xl"/> },
        { name: "Shellfish", icon: <GiSadCrab className="my-auto text-white text-5xl"/> },
        { name: "Tree Nuts", icon: <GiCoconuts className="my-auto text-white text-5xl"/> },
        { name: "Peanuts", icon: <GiPeanut className="my-auto text-white text-5xl"/> },
        { name: "Other", icon: <BiPlusCircle className="my-auto text-white text-5xl"/> },
    ];

    const initialModifier = iterator({ array: modifiers});

    const [ modifierOverlayOpen, setModifierOverlayOpen ] = useState(false);
    const [ modifierItem, setModifierItem ] = useState(null);
    const [ modifierTabSelected, setModifierTabSelected ] = useState(initialModifier.name);

    const openModifierOverlay = (baseOrderItem) => {
        setModifierOverlayOpen(true);
        setModifierItem(baseOrderItem);
        setModifierTabSelected(initialModifier.name);
    };

    const closeModifierOverlay = () => {
        setModifierOverlayOpen(false);
        setModifierItem(null);
    };

    const processAddToOrder = (menuItem) => {
        if(menuItem.allowMods === 'Yes'){
            const baseOrderItem = {
                menuItemID: menuItem.menuItemID,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1,
                ingredients: menuItem.ingredients,
                modifiers: {
                    sideList: menuItem.modifiers.sides,
                    sides: [],
                    substitutions: [],
                    notes: []
                }
            };
            openModifierOverlay(baseOrderItem);
        }
        else{
            const baseOrderItem = {
                menuItemID: menuItem.menuItemID,
                modified: 'false',
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1,
                ingredients: menuItem.ingredients,
                modifiers: {
                    sideList: [],
                    sides: [],
                    substitutions: [],
                    notes: []
                }
            };
            addToOrder(baseOrderItem);
        }
    };

    let sides;
    if(modifierItem != null){
        sides = modifierItem.modifiers.sideList;
    }

    let substitutions;
    if(modifierItem != null){
        substitutions = modifierItem.ingredients;
    };

    let itemData;
    if(modifierItem != null){
        itemData = modifierItem.modifiers.itemData;
    };

    const [ orderItem, setOrderItem ] = useState(null);
    
    useEffect(() => {
        if(modifierItem != null){
            setOrderItem(modifierItem);
        }
        if(modifierItem === null){
            setOrderItem(null);
        }
    },[modifierOverlayOpen]);

    const [ orderItemNotes, setOrderItemNotes ] = useState(null);

    const addSide = (props) => {
        setOrderItem(update(orderItem, { 
            modifiers: { sides: { $push: [props] }}
        }));
    };

    const removeSide = (index) => {
        setOrderItem(update(orderItem, {
            modifiers: { sides: { $splice: [[index, 1]] } }
        }));
    };

    const addIngredient = (props) => {
        const substitutionIndex = orderItem.modifiers.substitutions.findIndex(x => x.ingredientID === props.ingredientID);
        if(substitutionIndex != -1){
            const substitution = iterator({ array: orderItem.modifiers.substitutions.filter((substitution) => substitution.ingredientID === props.ingredientID)});
            if(substitution.quantity === -1){
                setOrderItem(update(orderItem, {
                    modifiers: { substitutions: { $splice: [[substitutionIndex, 1]] }}
                }));
            }
            else{
                const updatedQuantity = parseInt(substitution.quantity + 1);
                const updatedInventoryQuantity = updatedQuantity * props.quantity;
                const updatedPrice = Number(parseFloat(substitution.price + props.addonPrice).toFixed(2));
                setOrderItem(update(orderItem, {
                    modifiers: { substitutions: { [substitutionIndex]: { $merge: { price: updatedPrice, quantity: updatedQuantity, inventoryQuantity: updatedInventoryQuantity }}}}
                }));
            }
        }
        else{
            const substitution = {
                ingredientID: props.ingredientID,
                name: props.name,
                type: "Add",
                quantity: 1,
                inventoryQuantity: props.quantity,
                price: props.addonPrice,
            };
            setOrderItem(update(orderItem, { 
                modifiers: { substitutions: { $push: [substitution] }}
            }));
        }
    };

    const subIngredient = (props) => {
        console.log(props);
    };

    const removeFromList = (props) => {
        if(props.quantity === -1){
            const substitutionIndex = orderItem.modifiers.substitutions.findIndex(x => x.ingredientID === props.ingredientID);
            setOrderItem(update(orderItem, {
                modifiers: { substitutions: { $splice: [[substitutionIndex, 1]] }}
            }));
        }
        else{
            removeIngredient(props);
        }
    };

    const removeIngredient = (props) => {
        const substitutionIndex = orderItem.modifiers.substitutions.findIndex(x => x.ingredientID === props.ingredientID);
        if(substitutionIndex != -1){
            const substitution = iterator({ array: orderItem.modifiers.substitutions.filter((substitution) => substitution.ingredientID === props.ingredientID)});
            if(substitution.quantity > 1){
                const updatedQuantity = parseInt(substitution.quantity - 1);
                const updatedInventoryQuantity = updatedQuantity * props.quantity;
                const updatedPrice = Number(parseFloat(substitution.price - (substitution.price / substitution.quantity)).toFixed(2));
                setOrderItem(update(orderItem, {
                    modifiers: { substitutions: { [substitutionIndex]: { $merge: { price: updatedPrice, quantity: updatedQuantity, inventoryQuantity: updatedInventoryQuantity }}}}
                }));
            }
            if(substitution.quantity === 1){
                setOrderItem(update(orderItem, {
                    modifiers: { substitutions: { $splice: [[substitutionIndex, 1]] }}
                }));
            }
            if(substitution.quantity === -1){
                itemAlreadyRemoved();
            }
        }
        else{
            const substitution = {
                ingredientID: props.ingredientID,
                name: props.name,
                type: "No",
                quantity: -1,
                inventoryQuantity: -props.quantity,
                price: props.addonPrice,
            };
            setOrderItem(update(orderItem, { 
                modifiers: { substitutions: { $push: [substitution] }}
            }));
        }
    };

    let modifiedTotal;
    if(modifierItem != null){
        if(orderItem != null){
            let sideTotal;
            if(orderItem.modifiers.sides.length > 0){
                const sidesPrices = Array.from(orderItem.modifiers.sides.map(side => side.priceChange));
                sideTotal = sidesPrices.reduce((a, b) => a + b, 0);
            }
            else{
                sideTotal = 0;
            }
            let subsTotal;
            if(orderItem.modifiers.substitutions.length > 0){
                const subsPrices = Array.from(orderItem.modifiers.substitutions.map(sub => sub.price));
                subsTotal = subsPrices.reduce((a, b) => a + b, 0);
            }
            else{
                subsTotal = 0;
            }
            modifiedTotal = (orderItem.price + sideTotal + subsTotal).toFixed(2);
        }
        else{
            modifiedTotal = modifierItem.price.toFixed(2);
        }
    };

    const saveOrderItem = (orderItem) => {
        const ingredients = orderItem.ingredients.map((ingredient) => {
            return { type: 'Base', ingredientID: ingredient.ingredientID, name: ingredient.name, inventoryQuantity: ingredient.quantity }
        });
        const sideIngredients = [].concat(...orderItem.modifiers.sides.map((side) => side.ingredients)).map((ingredient) => {
            return { type: 'Side', ingredientID: ingredient.ingredientID, name: ingredient.name, inventoryQuantity: ingredient.quantity }
        });
        const subsIngredients = [].concat(...orderItem.modifiers.substitutions.map((sub) => {
            return { type: 'Sub', ingredientID: sub.ingredientID, name: sub.name, inventoryQuantity: sub.inventoryQuantity }
        }));
        const updatedIngredients = ingredients.concat(sideIngredients, subsIngredients);
        let modified;
        if(sideIngredients.length > 0 || subsIngredients.length > 0){
            modified = 'true'
        }
        else{
            modified = 'false'
        }
        const updatedOrderItem = {
            menuItemID: orderItem.menuItemID,
            name: orderItem.name,
            price: parseFloat(modifiedTotal),
            quantity: orderItem.quantity,
            ingredients: updatedIngredients,
            sides: orderItem.modifiers.sides,
            subs: orderItem.modifiers.substitutions,
            notes: "",
            modified: modified
        };
        addToOrder(updatedOrderItem);
    };

    const [ modifySideOverlay, setModifySideOverlay ] = useState(false);
    const [ modifySideItem, setModifySideItem ] = useState(null);
    const [ sideItem, setSideItem ] = useState(null);

    let side;
    if(modifySideItem != null){
        side = {
            name: modifySideItem.name,
            ingredients: modifySideItem.ingredients,
            price: modifySideItem.priceChange,
            quantity: modifySideItem.quantity,
            modifiers: []
        }
    }

    const openModifySideOverlay = (sideModifierItem) => {
        setModifySideOverlay(true);
        setModifySideItem(sideModifierItem);
    };

    useEffect(() => {
        setSideItem(side);
    }, [modifySideItem]);

    const closeModifySideOverlay = () => {
        setModifySideOverlay(false);
        setModifySideItem(null)
    };

    const addSideIngredient = (props) => {
        const sideIndex = sideItem.modifiers.findIndex(x => x.ingredientID === props.ingredientID);
        if(sideIndex != -1){
            const substitution = iterator({ array: sideItem.modifiers.filter((modifier) => modifier.ingredientID === props.ingredientID)});
            if(substitution.quantity === -1){
                setSideItem(update(sideItem, {
                    modifiers: { $splice: [[sideIndex, 1]] }
                }));
            }
            else{
                const updatedQuantity = parseInt(substitution.quantity + 1);
                const updatedInventoryQuantity = updatedQuantity * props.quantity;
                const updatedPrice = Number(parseFloat(substitution.price + props.addonPrice).toFixed(2));
                setSideItem(update(sideItem, {
                    modifiers: { [sideIndex]: { $merge: { price: updatedPrice, quantity: updatedQuantity }}}
                }));
            }
        }
        else{
            setSideItem(update(sideItem, { 
                modifiers: { $push: [props] }
            }));
        }
    };

    const removeSideIngredient = (ingredient) => {
        console.log(ingredient)
    };


    const ModifySideOverlay = () => {
        return(
            <Overlay 
            className="flex flex-col h-full" onClose={() => (closeModifySideOverlay())} 
            closeButtonClass="text-white hover:text-red-600 text-4xl top-3 right-2 -mt-2 pt-1"
            >
                <div className="flex flex-row items-center h-12 bg-gray-900 rounded-t-lg w-full">
                    <h1 className="font-headers text-2xl text-white ml-3">Modify {modifySideItem.name}</h1>
                </div>

                <div id="order-display" className="flex flex-row items-center h-full">

                    <div className="flex flex-col h-full w-3/4 overflow-auto">
                        {modifySideItem.ingredients.map((ingredient) => {
                            return(
                                <div className="flex flex-row items-center w-full rounded-sm shadow-md py-2 my-1">
                                    <h1 className="text-2xl font-content font-semibold ml-1">{ingredient.name}</h1>
                                    <BiPlusCircle onClick={() => addSideIngredient(ingredient)} className="text-3xl text-green-600 ml-auto" />
                                    <BiMinusCircle onClick={() => removeSideIngredient(ingredient)} className="text-3xl text-red-600 mx-2" />
                                </div>
                            )
                        })}

                    </div>
                    <div className="w-1/4" style={{height: scrollWrapperHeight}}>

                        <div className="relative flex flex-col h-full rounded-br-lg pt-1">

                            <div className="flex flex-row items-center rounded-tl-md bg-gray-900 mt-1 h-12">
                                <h1 className="text-white text-xl font-headers ml-2">Modified Item</h1>
                                <BiRefresh onClick={() => (setModifySideItem(side))} className="text-white text-3xl ml-auto mr-2"/>
                            </div>

                            <div id="order-list" className="h-full overflow-auto border-l-2 border-gray-100 border-opacity-50">
                                {sideItem ?
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center">
                                            <div className="flex flex-col">
                                                <h1 className="font-headers text-lg text-gray-900 mx-1">{sideItem.name}</h1>
                                            </div>         
                                            <p className="text-lg font-medium text-green-700 ml-auto mr-2">${sideItem.price}</p>
                                        </div>

                                        { sideItem.modifiers != null ? 
                                            <React.Fragment>
                                                {sideItem.modifiers.length > 0 ? 
                                                    <div className="flex flex-col mt-1">
                                                        <h1 className="font-content font-semibold text-lg border-b mx-1 mb-1">Modifiers</h1>
                                                        {sideItem.modifiers.map((item) => {
                                                            return(
                                                                <div className="flex flex-row items-center my-1">
                                                                    <BiMinusCircle className="mx-1 text-red-600 text-xl"/>
                                                                    {item.quantity >= 1 ?
                                                                        <React.Fragment>
                                                                            <p className="ml-1 text-base font-content font-semibold">Add {item.name}</p>
                                                                            <p className="ml-1 text-base font-content font-semibold">x {item.quantity}</p>
                                                                            { item.price > 0 ?
                                                                                <p className="ml-auto mr-3 font-content font-semibold text-base text-green-600">+ {item.price}</p>           
                                                                            : null }  
                                                                        </React.Fragment>
                                                                    : null}
                                                                    {item.quantity === -1 ?
                                                                        <React.Fragment>
                                                                            <p className="ml-1 text-base font-content font-semibold">No {item.name}</p>
                                                                        </React.Fragment>
                                                                    : null}                        
                                                                </div>                                         
                                                            )
                                                        })}
                                                    </div>
                                                : null }                
                                            </React.Fragment>
                                        : null }
                                    </div>
                                : null }
                            </div>

                            <div className="flex flex-row items-center rounded-b-md bg-gray-900 h-12">
                                <h1 className="text-white text-xl font-headers ml-2">Item Total</h1>
                                <p className="text-green-500 text-xl font-content font-semibold mx-auto">$ {modifiedTotal}</p>
                                <BiPlusCircle onClick={() => saveOrderItem(orderItem)} className="text-white text-3xl ml-auto mr-2"/>
                            </div>

                        </div>              
                    </div>
                </div>
            </Overlay>
        )
    };

    const [ substitutionOverlay, setSubstitutionOverlay ] = useState(false);

    const SubstitutionOverlay = () => {
        return(
            <Overlay 
            className="flex flex-col h-full" onClose={() => (setSubstitutionOverlay(false))} 
            closeButtonClass="text-white hover:text-red-600 text-4xl top-3 right-2 -mt-2 pt-1"
            >
                <div className="flex flex-row items-center h-12 bg-gray-900 rounded-t-lg w-full">
                    <h1 className="font-headers text-2xl text-white ml-3">Find Item</h1>
                </div>

                <div id="order-display" className="flex flex-row items-center h-full">
                </div>
            </Overlay>
        )
    };

    const ModifierOverlay = () => {

        const [ orderItemNote, setOrderItemNote ] = useState('');

        return(
            <Overlay 
            className="flex flex-col h-full" onClose={() => (closeModifierOverlay())} 
            closeButtonClass="text-white hover:text-red-600 text-4xl top-3 right-2 -mt-2 pt-1"
            >
                {modifySideOverlay === true ?
                    <ModifySideOverlay/>
                : null }
                {substitutionOverlay === true ?
                    <SubstitutionOverlay/>
                : null }
                <div className="flex flex-row items-center h-12 bg-gray-900 rounded-t-lg w-full">
                    <h1 className="font-headers text-2xl text-white ml-3">Set Order Item</h1>
                </div>
                <div id="order-display" className="flex flex-row items-center h-full">

                    <div className="flex flex-row w-3/4 pt-2 pr-1" style={{height: scrollWrapperHeight}}>  

                        <div className="flex flex-col w-1/5 h-full overflow-auto">
                            <div>
                                {modifiers.map((modifier) => {
                                    return(
                                        <div onClick={() => (setModifierTabSelected(modifier.name))} className={`flex flex-row items-center font-content font-semibold text-xl rounded-r-md p-1 mb-1 pl-2 ${modifierTabSelected === modifier.name ? 'text-white bg-gray-900' : 'text-gray-900 bg-white'}`}>
                                            {modifier.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="w-4/5 h-full ml-2 mr-1 h-full">

                            { modifierTabSelected === 'Sides' && sides != undefined ?
                                <div className="grid grid-cols-4 gap-1 h-full overflow-auto">
                                    {sides.map((side) => {
                                        return(
                                            <div onClick={() => addSide(side)} className="flex flex-row bg-gray-900 text-white text-center items-center justify-center font-content font-semibold text-xl rounded-md p-1 mb-1 h-1/4">
                                                {side.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            : null }

                            { modifierTabSelected === 'Modifiers' && substitutions != undefined ?
                                <div className="flex flex-col h-full overflow-auto">
                                    {substitutions.map((ingredient) => {
                                        return(
                                            <div className="flex flex-row items-center w-full rounded-sm shadow-md py-2 my-1">
                                                <h1 className="text-2xl font-content font-semibold ml-1">{ingredient.name}</h1>
                                                <BiPlusCircle onClick={() => addIngredient(ingredient)} className="text-3xl text-green-600 ml-auto" />
                                                <BiMinusCircle onClick={() => removeIngredient(ingredient)} className="text-3xl text-red-600 mx-2" />
                                            </div>
                                        )
                                    })}
                                </div>
                            : null }

                            { modifierTabSelected === 'Notes' ?
                                <div className="flex flex-col h-full overflow-auto">
                                    <h1 className="text-2xl font-content font-semibold m-1">Add Note</h1>
                                    <textarea className="text-xl text-top p-2 m-1 h-full outline-none border rounded-md focus:border-gray-900" style={{resize: 'none'}} placeholder="Add a note for this order item ..." name="orderNote" type="text" value={orderItemNote} onChange={(e) => setOrderItemNote(e.target.value)} />
                                    <div className="flex flex-row items-center p-2">
                                        <FaSave className="text-2xl mr-2" onClick={() => (setOrderItemNotes(orderItemNote),setOrderItemNote(''))}/>
                                        <h1 className="text-xl font-headers mb-1">Save Note</h1>
                                    </div>
                                </div>
                            : null }

                            { modifierTabSelected === 'Item Data' && itemData != undefined ?
                                <div className="flex flex-col h-full overflow-auto">
                                    <h1 className="">Additional Item Data</h1>

                                </div>
                            : null }

                        </div>

                    </div>

                    <div className="w-1/4" style={{height: scrollWrapperHeight}}>

                        <div className="relative flex flex-col h-full rounded-br-lg pt-1">

                            <div className="flex flex-row items-center rounded-tl-md bg-gray-900 mt-1 h-12">
                                <h1 className="text-white text-xl font-headers ml-2">Order Item</h1>
                                <BiRefresh onClick={() => (setOrderItem(modifierItem))} className="text-white text-3xl ml-auto mr-2"/>
                            </div>

                            <div id="order-list" className="h-full overflow-auto border-l-2 border-gray-100 border-opacity-50">
                                {modifierItem ?
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center">
                                            <div className="flex flex-col">
                                                <h1 className="font-headers text-lg text-gray-900 mx-1">{modifierItem.name}</h1>
                                            </div>         
                                            <p className="text-lg font-medium text-green-700 ml-auto mr-2">${modifierItem.price}</p>
                                        </div>
                                        { orderItem != null ? 
                                            <React.Fragment>

                                                {orderItem.modifiers.sides.length > 0 ? 
                                                    <div className="flex flex-col mt-1">
                                                        <h1 className="font-content font-semibold text-lg border-b mx-1 mb-1">Side</h1>
                                                        {orderItem.modifiers.sides.map((side, index) => {
                                                            return(
                                                                <div className="flex flex-row items-center">
                                                                    <BiMinusCircle onClick={() => removeSide(index)} className="mx-1 text-red-600 text-lg"/>
                                                                    <p className="ml-1 text-base font-content font-semibold">{side.name}</p>
                                                                    {side.priceChange != 0 ? 
                                                                        <p className={`ml-auto mr-3 font-content font-semibold text-base ${side.priceChange > 0 ? `text-green-600` : 'text-red-700'}`}>{side.priceChange > 0 ? "+" : "-"}{side.priceChange}</p>
                                                                    : null }                                   
                                                                </div>                                         
                                                            )
                                                        })}
                                                    </div>
                                                : null }

                                                {orderItem.modifiers.substitutions.length > 0 ? 
                                                    <div className="flex flex-col mt-1">
                                                        <h1 className="font-content font-semibold text-lg border-b mx-1 mb-1">Modifiers</h1>
                                                        {orderItem.modifiers.substitutions.map((ingredient) => {
                                                            return(
                                                                <div className="flex flex-row items-center my-1">
                                                                    <BiMinusCircle onClick={() => removeFromList(ingredient)} className="mx-1 text-red-600 text-xl"/>
                                                                    {ingredient.quantity >= 1 ?
                                                                        <React.Fragment>
                                                                            <p className="ml-1 text-base font-content font-semibold">Add {ingredient.name}</p>
                                                                            <p className="ml-1 text-base font-content font-semibold">x {ingredient.quantity}</p>
                                                                            { ingredient.price > 0 ?
                                                                                <p className="ml-auto mr-3 font-content font-semibold text-base text-green-600">+ {ingredient.price}</p>           
                                                                            : null }  
                                                                        </React.Fragment>
                                                                    : null}
                                                                    {ingredient.quantity === -1 ?
                                                                        <React.Fragment>
                                                                            <p className="ml-1 text-base font-content font-semibold">No {ingredient.name}</p>
                                                                        </React.Fragment>
                                                                    : null}
                                                                                                 
                                                                </div>                                         
                                                            )
                                                        })}
                                                    </div>
                                                : null }

                                                {orderItemNotes != null ? 
                                                    <div className="flex flex-col mt-1">
                                                        <h1 className="font-content font-semibold text-lg border-b mx-1 mb-1">Notes</h1>
                                                        <div className="flex flex-row items-center">
                                                            <BiMinusCircle onClick={() => setOrderItemNotes(null)} className="mx-1 text-red-600 text-lg"/>
                                                            <p className="ml-1 text-base font-content font-semibold">{orderItemNotes}</p>
                                                        </div>                                         
                                                    </div>
                                                : null }
                                                
                                            </React.Fragment>
                                        : null }
                                    </div>
                                : null }
                            </div>

                            <div className="flex flex-row items-center rounded-b-md bg-gray-900 h-12">
                                <h1 className="text-white text-xl font-headers ml-2">Item Total</h1>
                                <p className="text-green-500 text-xl font-content font-semibold mx-auto">$ {modifiedTotal}</p>
                                <BiPlusCircle onClick={() => saveOrderItem(orderItem)} className="text-white text-3xl ml-auto mr-2"/>
                            </div>

                        </div>              
                    </div>
                </div>

            </Overlay>

        )
    };

    return(
        <div className="flex flex-col h-full">

            { modifierOverlayOpen === true ?
                <ModifierOverlay />
            : null }

            {children}

            { displayType === 'New Order' && seat != undefined ?

                <React.Fragment>

                    <div className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-xl">
                        <h1 className="font-headers text-2xl text-white ml-3">Seat {seat.seatNumber} New Order</h1>
                        <div className="flex flex-row items-center ml-4">
                            {menus.map((menu) => {
                                return(
                                    <div onClick={() => (setMenuTabSelected(menu))} className={`font-headers text-2xl mx-2 px-6 pb-1 rounded-md ${menuTabSelected === menu ? 'text-gray-900 bg-white' : 'text-white bg-gray-900'}`}>
                                        {menu.menuName}
                                    </div>              
                                )
                            })}
                        </div>
                    </div>

                    <div id="order-display" className="flex flex-row items-center h-full">

                        <div className="flex flex-row w-3/4 pt-2 pr-1" style={{height: scrollWrapperHeight}}>                    
                            <div className="flex flex-col w-1/5 h-full overflow-auto">
                                { categories != undefined ?
                                    <div>
                                        {categories.map((category) => {
                                            return(
                                                <div onClick={() => (setCategoryTabSelected(category))} className={`flex flex-row items-center justify-center font-content font-semibold text-xl rounded-r-md p-1 mb-1 ${categoryTabSelected === category ? 'text-white bg-gray-900' : 'text-gray-900 bg-white'}`}>
                                                    {category.categoryName}
                                                </div>
                                            )
                                        })}
                                    </div>
                                : null }
                            </div>
                            <div className="grid grid-cols-4 w-4/5 h-full ml-1 overflow-auto">
                                { menuItems != undefined ?
                                    <div>
                                        {menuItems.map((menuItem) => {
                                            return(
                                                <div onClick={() => (processAddToOrder(menuItem))} className="flex flex-row bg-gray-900 text-white text-center items-center justify-center font-content font-semibold text-xl rounded-md p-1 mb-1 h-1/4">
                                                    {menuItem.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                : null }
                            </div>
                        </div>

                        <div className="w-1/4" style={{height: scrollWrapperHeight}}>
                            <div className="relative flex flex-col h-full rounded-br-lg pt-1">
                                <div className="flex flex-row items-center rounded-tl-md bg-gray-900 mt-1 h-12">
                                    <h1 className="text-white text-xl font-headers ml-2">Order Items</h1>
                                    <FaTrashAlt onClick={() => clearOrder()} className="text-white text-xl ml-auto mr-2"/>
                                </div>
                                <div id="order-list" className="h-full overflow-auto border-l-2 border-gray-100 border-opacity-50">
                                {seatOrderList.map((orderItem, index) => {
                                    return(
                                        <div className="flex flex-col mt-1 rounded-sm shadow-sm">
                                            <div className="flex flex-row items-center ml-1">
                                                <BiMinusCircle onClick={() => (removeFromOrder(orderItem, index))} className="text-red-600 text-xl" />
                                                <h1 className="font-headers text-lg text-gray-900 ml-2">{orderItem.name}</h1>
                                            </div>      
                                            <div className="flex flex-col mx-1 mt-1">
                                                {orderItem.sides.length > 0 ?
                                                    <React.Fragment> 
                                                        {orderItem.sides.map((side) => {
                                                            return(
                                                                <p className="italic ml-2 text-base font-content font-medium">Side {side.name}</p>
                                                            )              
                                                        })}
                                                    </React.Fragment>
                                                : null }
                                                {orderItem.subs.length > 0 ?
                                                    <React.Fragment> 
                                                        {orderItem.subs.map((sub) => {
                                                            return(
                                                                <p className="italic ml-2 text-base font-content font-medium">{sub.name}</p>
                                                            )              
                                                        })}
                                                    </React.Fragment>
                                                : null }
                                                {orderItem.notes != null ?
                                                    <p className="italic ml-2 text-base font-content font-medium">{orderItem.notes}</p>
                                                : null }
                                            </div>           
                                            <div className="flex flex-row items-center mx-1 border-t border-gray-300 border-opacity-60">
                                                <h1 className="text-base font-medium text-gray-900 ml-1">Qty: {orderItem.quantity}</h1>
                                                <p className="text-lg font-medium text-green-700 ml-auto mr-1">${orderItem.price}</p>
                                            </div>                            
                                        </div>
                                    )
                                })}
                                </div>
                                <div className="flex flex-row items-center rounded-br-md bg-gray-900 h-12">
                                    <h1 className="text-white text-xl font-headers ml-2">Order Total</h1>
                                    <p className="text-green-500 text-xl font-content font-semibold mx-auto">$ {orderTotal}</p>
                                    <FaSave onClick={() => saveOrder(seat.seatNumber)} className="text-white text-2xl -mb-1 ml-auto mr-2"/>
                                </div>
                            </div>              
                        </div>

                    </div>

                </React.Fragment>
            :
                null
            }

            { displayType === 'Allergies' && seat != undefined ?

                <React.Fragment>

                    <div className="flex flex-row items-center h-12 bg-gray-900 rounded-t-lg w-full">
                        <h1 className="font-headers text-2xl text-white ml-3">Set Allergies for Seat {seat.seatNumber}</h1>
                    </div>

                    <div id="order-display" className="flex flex-row items-center h-full">

                        <div className="flex flex-row w-3/4 pt-2 pr-1" style={{height: scrollWrapperHeight}}>  

                            <div className="grid grid-cols-3 gap-1 w-full">
                                {allergies.map((allergy) => {
                                    return(
                                        <div className="flex flex-col items-center justify-center bg-gray-900 rounded-md">           
                                            {allergy.icon}
                                            <h1 className="mb-2 text-2xl font-headers text-white">{allergy.name}</h1>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>

                        <div className="w-1/4" style={{height: scrollWrapperHeight}}>

                            <div className="relative flex flex-col h-full rounded-br-lg pt-1">

                                <div className="flex flex-row items-center rounded-tl-md bg-gray-900 mt-1 h-12">
                                    <h1 className="text-white text-xl font-headers ml-2">Allergy List</h1>
                                    <BiRefresh onClick={() => clearOrder()} className="text-white text-3xl ml-auto mr-2"/>
                                </div>

                                <div id="order-list" className="h-full overflow-auto border-l-2 border-gray-100 border-opacity-50">
                                    {seatOrderList.map((orderItem) => {
                                        return(
                                            <div className="flex flex-row items-center">
                                                <div className="flex flex-col">
                                                    <h1 className="font-headers text-lg text-gray-900 mx-1">{orderItem.name}</h1>
                                                    <h1 className="text-sm font-medium text-gray-900 mx-1">Qty: {orderItem.quantity}</h1>
                                                </div>
                                                    
                                                <p className="text-lg font-medium text-green-700 ml-auto mr-2">${orderItem.price}</p>
                                                <BiMinusCircle onClick={() => (removeFromOrder(orderItem))} className="text-red-600 text-xl mr-2" />
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="flex flex-row items-center rounded-b-md bg-gray-900 h-12">
                                    <h1 className="text-white text-xl font-headers ml-auto">Save</h1>
                                    <FaSave onClick={() => saveOrder(seat.seatNumber)} className="text-white text-2xl mx-2"/>
                                </div>

                            </div>              
                    </div>
                </div>
                </React.Fragment>

            :
                null
            }

            { displayType === 'Transfers' && seat != undefined ?

                <div className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-xl">
                    <h1 className="font-headers text-2xl text-white ml-3">Seat {seat.seatNumber} Transfers</h1>
                </div>

            :
                null
            }

            { displayType === 'History' && seat != undefined ?

                <div className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-xl">
                    <h1 className="font-headers text-2xl text-white ml-3">Seat {seat.seatNumber} History</h1>
                </div>

            :
                null
            }

            { displayType === 'Payments' && seats != undefined ?
                    
                <div className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-xl">
                    <h1 className="font-headers text-2xl text-white ml-3">Payments</h1>
                </div>

            :
                null
            }
                
        </div>
    )
};

const DeleteSeatOverlay = ({ seatID, seatNumber, tableID, tableNumber, active, close }) => {

    const [ removeSeat ] = useMutation(deleteSeat, {
        variables: {
            tableID: String(tableID),
            seatID: String(seatID)
        }
    });
 
    const deleteSeatByID = async () => {
        close();
        await removeSeat();
        seatRemovedToast();
    };

    if(active === true){

        return(
            <React.Fragment>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300 z-40 opacity-80"/>
                <div className="absolute top-1/2 left-1/2 transform translate -translate-x-1/2 -translate-y-1/2 w-3/5 h-1/2 bg-white shadow-lg rounded-lg z-50 flex flex-col items-center justify-center">
                    <h1 className="font-headers font-semibold text-2xl">Are you sure you want to delete Seat {seatNumber} from Table {tableNumber}  ?</h1>
                    <div className="flex flex-row items-center mt-10">
                        <button onClick={close} className="bg-red-600 hover:bg-red-700 text-white font-headers text-2xl pb-2 pt-1 px-5 mx-2 font-medium rounded-lg shadow-lg">Cancel</button>
                        <button onClick={() => deleteSeatByID()}className="bg-green-600 hover:bg-green-700 text-white font-headers text-2xl pb-2 pt-1 px-5 mx-2 font-medium rounded-lg shadow-lg">Delete</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    else{
        return null;
    }
};


const UpdateServiceOverlay = ({ tableID, tableNumber, section, active, close}) => {

    const context = useContext(Context);
    const tableData = context.tables.filter((table) => table.tableID === tableID);
                
    const iterator = ({array}) => {
        let iterator = array.values();
        for (let elements of iterator) {   
          return elements;   
        };
      };

    const table = iterator({ array: tableData});

    let seatsData;
    if(table != null && table != undefined){
        if(table != null && active === true){
            seatsData = table.service.seats;
        }
    }

    let seats;
    if(seatsData != null && seatsData != undefined) {
        seats = Array.from(seatsData.map(seat => seat))
    }

    function compare( a, b ) {
        if ( a.seatNumber < b.seatNumber ){
          return -1;
        }
        if ( a.seatNumber > b.seatNumber ){
          return 1;
        }
        return 0;
      }
      
      if(seats != null && seats != undefined){
        seats = seats.sort( compare );
      }
    

    const [ newSeatNumber, setNewSeatNumber ] = useState(1);
    const [ seatChange, setSeatChange ] = useState(false);
    const [ seatLoading, setSeatLoading ] = useState(false);

    let seatNumbers;
    if(seats != null && seats != undefined){
        seatNumbers = Array.from(seats.map(seat => seat.seatNumber));
    }
    else{
        seatNumbers = [];
    }

    let seatIndex;
    if(seats != null && seatNumbers.length >= 1){
        seatIndex = seatNumbers.findIndex(x => x == newSeatNumber);
    }

    useEffect(() => {
        if(seatIndex != undefined){
            if(seatIndex !== -1){
                setNewSeatNumber(newSeatNumber + 1);
            }
        }
        }, [ seats, seatNumbers, active ]);

    useEffect(() => {
        if(seats != null && seatNumbers.length != seats.length){
            setNewSeatNumber(1);
        }
    }, [seats]);

    useEffect(() => {
        if(seatChange === true){
            setSeatLoading(false);
            setSeatChange(false);
            setNewSeatNumber(1);
        }
    }, [ seatNumbers.length ]);


    const newSeatID = String(`Seat${newSeatNumber}-Table${tableNumber}-${section}-${Math.floor(Math.random() * 10000000000)}`).replace(/\s+/g, '');

    const [ newSeat ] = useMutation(createSeat, {
        variables: {
            tableID: String(tableID),
            seats: { seatID: String(newSeatID), seatNumber: parseInt(newSeatNumber), openedAt: new Date()}
        }
    });

    const addSeat = async() => {
        setSeatLoading(true);
        await newSeat();
        seatAddedToast();
        setSeatChange(true);
    };
        
    const closeOverlay = async () => {
        await close();
        setNewSeatNumber(1);
        setDisplayType(null);
    };

    const [ deleteSeatOverlay, setDeleteSeatOverlay ] = useState(false);
    const [ deleteSeatID, setDeleteSeatID ] = useState(null);
    const [ deleteSeatNumber, setDeleteSeatNumber ] = useState(null);

    const openDeleteSeatOverlay = (seatID, seatNumber) => {
        setDeleteSeatID(seatID);
        setDeleteSeatNumber(seatNumber);
        setDeleteSeatOverlay(true);
        setSeatChange(true);
        setDisplayType(null);
    };

    const [ displayType, setDisplayType ] = useState(null);
    const [ displaySeatID, setDisplaySeatID ] = useState(null);
    const [ auxiliaryButtonClass, setAuxiliaryButtonClass ] = useState('hidden');

    useEffect(() => {
        if(displayType === null){
            setAuxiliaryButtonClass('hidden');
        }
        else{
            setAuxiliaryButtonClass('visible');
        }
    }, [ displayType ])

    const openDisplay = (displayType, seatData) => {
        setDisplayType(displayType);
        setDisplaySeatID(seatData);
    };

    let seatOrders;
    if(seats != null && seats != undefined){
        const orderSeatList = seats.filter((seat) => seat.orders.length > 0);
        const orderSeats = orderSeatList.map((seat) => { return {...seat, orders: seat.orders.filter((order) => order.orderStatus === 'Saved')}});
        const orders = orderSeats.filter((seat) => seat.orders.length > 0);
        seatOrders = orders;
    }

    let seatOrderLength;
    if(seatOrders != undefined){
        seatOrderLength = seatOrders.length
    }

    useEffect(() => {
        setDisplayType(null);
    }, [seatOrderLength])

    const [ placeSeatOrder ] = useMutation(updateSeatOrder);

    const placeOrder = (seat) => {
        const orderData = iterator({ array: seat.orders });
        const orderID = orderData.orderID;
        const orderObject = { tableID: String(tableID), seatID: String(seat.seatID), orderStatus: "Sent" };
        placeSeatOrder({ variables: { tableID: String(tableID), seatID: String(seat.seatID), orderID: String(orderID), orders: orderObject}});
    };

    const sendOrder = async () => {
        if(seatOrders != undefined && seatOrders.length > 0){
            await seatOrders.forEach((seat) => placeOrder(seat));
            orderSentToast();
        }
        else{
            noOrdersToast();
        }
    };

    const [ deleteSeatOrderByID ] = useMutation(deleteSeatOrder);

    const removeSeatOrder = (seat, order) => {
        deleteSeatOrderByID({ variables: { tableID: String(tableID), seatID: String(seat.seatID), orderID: String(order.orderID) }});
        orderRemoved();
    };

    const [ deleteSeatOrderItemByID ] = useMutation(deleteSeatOrderItem);

    const removeSeatOrderItem = (seat, order, orderItem) => {
        if(order.orderItems.length > 1 ){
            deleteSeatOrderItemByID({ variables: { tableID: String(tableID), seatID: String(seat.seatID), orderID: String(order.orderID), orderItemID: String(orderItem.orderItemID) }})
        }
        else{
            deleteSeatOrderByID({ variables: { tableID: String(tableID), seatID: String(seat.seatID), orderID: String(order.orderID) }})
        }
        itemRemoved();
    };

    const [ tableOverviewHeight, setTableOverviewHeight ] = useState(null);
    const [ seatGridBoxHeight, setSeatGridBoxHeight ] = useState(null);
    const [ seatDataWrapperHeight, setSeatDataWrapperHeight ] = useState(null);
    const [ seatDataHeight, setSeatDataHeight ] = useState(null);

    useEffect(() => {
        if(document.getElementById("table-overview-display") != null){
            setTableOverviewHeight(document.getElementById("table-overview-display").offsetHeight - document.getElementById("table-overview-header").offsetHeight);
        }
        if(seats != null){
            if(seats.length <= 3){
                setSeatGridBoxHeight(tableOverviewHeight - 3)
            }
            else{
                setSeatGridBoxHeight((tableOverviewHeight/2)-3)
            }
        }
        if(document.getElementById('seat-gridbox') != null && document.getElementById('seat-gridbox-header') != null){
            setSeatDataWrapperHeight(document.getElementById('seat-gridbox').offsetHeight - document.getElementById('seat-gridbox-header').offsetHeight)
        }  
        if(document.getElementById('seat-order-data-header') != null && seatDataWrapperHeight != null){
            setSeatDataHeight(seatDataWrapperHeight - document.getElementById('seat-order-data-header').offsetHeight);
        }                                                     
    })


    if(active === true){


        return(
            <Overlay 
                className="flex flex-col h-full" onClose={() => (closeOverlay())} 
                closeButtonClass="text-white hover:text-red-600 text-4xl top-3 right-2 -mt-2 pt-1"
                auxiliaryButtons={<BiCaretLeftCircle onClick={() => (setDisplayType(null))} className={`${auxiliaryButtonClass} absolute text-white text-4xl top-3 -mt-2 pt-1 right-12 hover:text-green-600 cursor-pointer z-50`}/>}
            >

                <div className="flex flex-grow flex-row h-full">

                    <DeleteSeatOverlay seatID={deleteSeatID} seatNumber={deleteSeatNumber} tableID={tableID} tableNumber={tableNumber} active={deleteSeatOverlay} close={() => (setDeleteSeatOverlay(false))} />

                    <div className="flex flex flex-col shadow-lg rounded-lg w-full h-full">

                            <SeatDisplay displayType={displayType} tableID={tableID} tableNumber={tableNumber} section={section} seatID={displaySeatID} seats={seats}>

                                { displayType === null && seats != null ?

                                    <div id="table-overview-display" className="flex flex-col h-full">
                                        <div id="table-overview-header" className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-xl">
                                            <h1 className="font-headers text-2xl text-white ml-3">Table {tableNumber} Overview</h1>
                                            <div className="flex flex-row items-center ml-2 mr-auto">
                                                <RiSendPlaneFill onClick={() => sendOrder()} className="cursor-pointer text-4xl text-gray-300 ml-2 p-1"/>
                                                <FaDollarSign onClick={() => (openDisplay(`${'Payments'}`))} className="text-3xl pt-1 mb-1 text-gray-200 hover:text-green-600 ml-2"/>
                                                <FaCog className="cursor-pointer text-4xl text-gray-300 p-1 mx-2"/>
                                                { seatLoading === false ?
                                                    <FaUserPlus onClick={()=> (addSeat())} className="cursor-pointer text-3xl text-green-500 m-1"/>
                                                :
                                                    <ImSpinner6 className="text-white text-2xl filter drop-shadow-md loading m-1"/>
                                                }
                                                
                                            </div>
                                        </div>

                                        <div id="seat-grid" className="grid grid-cols-3 gap-1 overflow-auto" style={{height: tableOverviewHeight}} >
                                            {seats ?
                                                <React.Fragment>
                                                    {seats.map((seat) => {
                                                        const completedOrder = seat.orders.filter((order) => order.orderStatus === 'Ready');
                                                        const inProgressOrder = seat.orders.filter((order) => order.orderStatus === 'In Progress');  
                                                        const sentOrder =  seat.orders.filter((order) => order.orderStatus === 'Sent');  
                                                        const savedOrder = seat.orders.filter((order) => order.orderStatus === 'Saved');                                      
                                                        return(
                                                            <div id="seat-gridbox" className="relative border rounded-sm shadow-md" style={{height: seatGridBoxHeight}}>
                                                                <div id="seat-gridbox-header" className="relative flex flex-row items-center h-12 bg-gray-900 rounded-t-sm">
                                                                    <div className="w-12 h-full border-r-2 border-gray-700 flex flex-row items-center justify-center">
                                                                        <h1 className="font-headers text-2xl text-white">{seat.seatNumber}</h1>
                                                                    </div>
                                                                    <div className="flex flex-row items-center space-x-2 ml-2">
                                                                        { sentOrder.length > 0 ?
                                                                            <div className="relative -mb-1">
                                                                                <div className="absolute -top-2 -right-1 rounded-sm bg-white text-black font-bold flex flex-row items-center justify-center h-3 w-3 text-xs">
                                                                                    {sentOrder.length}
                                                                                </div>
                                                                                <FaClipboardList className="text-red-600 text-lg"/>
                                                                            </div>
                                                                        : null}
                                                                        { inProgressOrder.length > 0 ?
                                                                            <div className="relative -mb-1">
                                                                                <div className="absolute -top-2 -right-1 rounded-sm bg-white text-black font-bold flex flex-row items-center justify-center h-3 w-3 text-xs">
                                                                                    {inProgressOrder.length}
                                                                                </div>
                                                                                <GiCook className="text-orange-600 text-xl"/>
                                                                            </div>
                                                                        : null}
                                                                        { completedOrder.length > 0 ?
                                                                            <div className="relative -mb-1">
                                                                                <div className="absolute -top-2 -right-1 rounded-sm bg-white text-black font-bold flex flex-row items-center justify-center h-3 w-3 text-xs">
                                                                                    {completedOrder.length}
                                                                                </div>
                                                                                <FaConciergeBell className="text-green-600 text-xl"/>
                                                                            </div>
                                                                        : null}
                                                                    </div>
                                                                    <div className="ml-auto mr-2 w-1/2">
                                                                        <div className="flex flex-row items-center justify-evenly w-full">   
                                                                            <IoFastFoodSharp onClick={() => (openDisplay(`${'New Order'}`, seat.seatID))} className="text-2xl text-white hover:text-green-600"/>
                                                                            <FaUserNurse onClick={() => (openDisplay(`${'Allergies'}`, seat.seatID))} className="text-2xl text-white hover:text-green-600 mx-1"/>
                                                                            <BiTransfer  onClick={() => (openDisplay(`${'Transfers'}`, seat.seatID))} className="text-2xl text-white hover:text-indigo-600 mr-1"/>                       
                                                                            <FaHistory onClick={() => (openDisplay(`${'History'}`, seat.seatID))} className="text-xl text-white hover:text-gray-500"/>                                      
                                                                            <BiMinusCircle onClick={() => (openDeleteSeatOverlay(seat.seatID, seat.seatNumber))} className="text-2xl text-red-600 cursor-pointer ml-2 -mr-1"/>
                                                                        </div> 
                                                                    </div> 
                                                                </div>
                                                                
                                                                    {savedOrder.length >= 1 ?
                                                                        <div id="seat-data" style={{height: seatDataWrapperHeight}}>
                                                                            {savedOrder.map((order) => {
                                                                                
                                                                                return(
                                                                                    <React.Fragment>

                                                                                        <div id="seat-order-data-header" className="flex flex-row items-center bg-gray-200 p-1">
                                                                                            <h1 className="font-headers text-xl ml-1">Order Items</h1>
                                                                                            <FaEdit className="text-gray-900 text-xl ml-auto"/>    
                                                                                            <BiXCircle onClick={() => (removeSeatOrder(seat, order))} className="text-red-600 text-2xl mx-1" />
                                                                                        </div>   

                                                                                        {order.orderItems.map((orderItem) => {

                                                                                                return(
                                                                                                <div id="seatData" className="flex flex-col pt-1 rounded-sm shadow-sm overflow-auto" style={{height: seatDataHeight}}>
                                                                                                    <div className="flex flex-row items-center ml-1">
                                                                                                        <BiMinusCircle onClick={() => (removeSeatOrderItem(seat, order, orderItem))} className="text-red-600 text-xl" />
                                                                                                        <h1 className="font-content font-semibold text-lg text-gray-900 ml-2">{orderItem.name}</h1>
                                                                                                    </div>      
                                                                                                    <div className="flex flex-col mx-1 mt-1">
                                                                                                        {orderItem.sides.length > 0 ?
                                                                                                            <React.Fragment> 
                                                                                                                {orderItem.sides.map((side) => {
                                                                                                                    return(
                                                                                                                        <p className="italic ml-2 text-base font-content font-medium">Side {side.name}</p>
                                                                                                                    )              
                                                                                                                })}
                                                                                                            </React.Fragment>
                                                                                                        : null }
                                                                                                        {orderItem.subs.length > 0 ?
                                                                                                            <React.Fragment> 
                                                                                                                {orderItem.subs.map((sub) => {
                                                                                                                    return(
                                                                                                                        <p className="italic ml-2 text-base font-content font-medium">{sub.name}</p>
                                                                                                                    )              
                                                                                                                })}
                                                                                                            </React.Fragment>
                                                                                                        : null }
                                                                                                        {orderItem.notes != '' ?
                                                                                                            <p className="italic ml-2 text-base font-content font-medium">{orderItem.notes}</p>     
                                                                                                        : null }
                                                                                                    </div>           
                                                                                                    <div className="flex flex-row items-center mx-1 border-t border-gray-300 border-opacity-60">
                                                                                                        <h1 className="text-base font-medium text-gray-900 ml-1">Qty: {orderItem.quantity}</h1>
                                                                                                        <p className="text-lg font-medium text-green-700 ml-auto mr-1">${orderItem.price}</p>
                                                                                                    </div>                            
                                                                                                </div>
                                                                                            )
                                                                                        })}
                                                                                    </React.Fragment>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    : null }
                                                                    
                                                                </div>
                                                        )
                                                    })}
                                                </React.Fragment>
                                            :
                                                null
                                            }

                                        </div>
                                    </div>
                                :
                                    null
                                }
                            </SeatDisplay>   
                    </div>
                </div>
            </Overlay>
        )
}
else{
return null;
}
};


const DeleteTableOverlay = ({ tableID, tableNumber, section, active, close }) => {

    const [ removeTable ] = useMutation(deleteTable, { 
        variables: { tableID: String(tableID) } 
    });
 
    const deleteTableByID = () => {
        close();
        removeTable();
    };

    if(active === true){

        return(
            <React.Fragment>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300 z-40 opacity-80"/>
                <div className="absolute top-1/2 left-1/2 transform translate -translate-x-1/2 -translate-y-1/2 w-3/5 h-1/2 bg-white shadow-lg rounded-lg z-50 flex flex-col items-center justify-center">
                    <h1 className="font-headers font-semibold text-2xl">Are you sure you want to delete Table {tableNumber} from {section}  ?</h1>
                    <div className="flex flex-row items-center mt-10">
                        <button onClick={close} className="bg-red-600 hover:bg-red-700 text-white font-headers text-2xl pb-2 pt-1 px-5 mx-2 font-medium rounded-lg shadow-lg">Cancel</button>
                        <button onClick={() => deleteTableByID()}className="bg-green-600 hover:bg-green-700 text-white font-headers text-2xl pb-2 pt-1 px-5 mx-2 font-medium rounded-lg shadow-lg">Delete</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    else{
        return null;
    }
};


export { UpdateServiceOverlay, DeleteTableOverlay }
