import React, { useContext, useEffect, useState } from "react"
import Context  from '../context/createContext';
import {  GetSections, GetTables, GetMenu, GetInventory } from '../apollo/fetch'
import Navigation from '../components/navigation';
import craveLogoDark from '../assets/images/crave-black-bg.png';
import Home from './home';
import Guests from './guests';
import Orders from './orders';
import Payments from './payments';
import Reservations from './reservations';
import User from './user';
import Settings from './settings';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { SiGooglecalendar } from 'react-icons/si';
import { IoFastFoodSharp } from 'react-icons/io5';
import { MdDeleteForever, MdFiberManualRecord, MdUndo, MdHome, MdAirlineSeatLegroomNormal } from 'react-icons/md';
import { FaCashRegister, FaUserAlt, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const CravePOS = () => {

  const context = useContext(Context);
  const userList = context.users;

  const [ sections, setSections ] = useState([]);
  const [ tables, setTables ] = useState([]);
  const [ menu, setMenu ] = useState([]);
  const [ inventory, setInventory ] = useState([]);

  const sectionData = GetSections();
  const tableData = GetTables();
  const menuData = GetMenu();
  const inventoryData = GetInventory();

  useEffect(() => {
    if(sectionData != undefined){
        setSections(sectionData.getAllSections);
    }
  }, [ sectionData ]);

  useEffect(() => {
    if(tableData != undefined){
        setTables(tableData.getAllTables);
    }
  }, [ tableData ]);

  useEffect(() => {
    if(menuData != undefined){
        setMenu(menuData.getAllMenus);
    }
  }, [ menuData ]);

  useEffect(() => {
    if(inventoryData != undefined){
        setInventory(inventoryData.getAllInventory);
    }
  }, [ inventoryData ]);

  const [ pin, setPin ] = useState('');
  const [ user, setUser ] = useState(null);
  const [ loggedIn, setLoggedIn ] = useState(false);

  const loginToast= () => {
    toast("Succesfully Logged In", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const logoutToast= () => {
    toast("Logged Out", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast green-toast",
      });
  };

  const incorrectPinToast= () => {
    toast("Incorrect Pin", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        className: "custom-toast red-toast",
      });
  };

  const Auth = () => {
        const pinEntry = pin;
        const getUser = userList.filter((user) => user.pin === parseInt(pinEntry))[0];
        if(getUser === undefined){
          const userExists = false;
          return userExists;
        }
        else{
          return getUser;
        }
    };

  const login = async () => {
      const auth = await Auth();
      if(auth === false){
        setPin('');
        incorrectPinToast();
      }
      else{
        setUser(auth);
        loginToast();
        setPin('');
      }
    };

  const history = useHistory();

  function redirectHome() {
    history.push("/");
  }

  const logout = async () => {
    await setUser(null);
    logoutToast();
    redirectHome();
  };

  const Logout = () => {
    return(
      <React.Fragment>
        { loggedIn === true ?
        <button className="text-xl font-headers font-medium absolute right-4 bg-red-600 pb-2 pt-1 px-5 rounded-lg" onClick={logout}>Logout</button>
        : null }
      </React.Fragment>
    );
  };

  useEffect(() => {
    if(pin.length === 6){
      login();
    }
  },[pin])

  useEffect(() => {
    if(user !== null){
      setLoggedIn(true);
    }
    else{
      setLoggedIn(true);
    }
  }, [user])

  const PinDisplay = () => {
    if(pin.length === 0){
        return null;
    }
    if(pin.length === 1){
        return (
          <React.Fragment>
            <MdFiberManualRecord className="text-4xl"/>
          </React.Fragment>
        )
    }
    if(pin.length === 2){
        return (
          <React.Fragment>
            <MdFiberManualRecord className="text-4xl"/>
            <MdFiberManualRecord className="text-4xl"/>
          </React.Fragment>
        )
    }
    if(pin.length === 3){
      return (
        <React.Fragment>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
        </React.Fragment>
      )
    }
    if(pin.length === 4){
      return (
        <React.Fragment>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
        </React.Fragment>
      )
    }
    if(pin.length === 5){
      return (
        <React.Fragment>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
        </React.Fragment>
      )
    }
    if(pin.length === 6){
      return (
        <React.Fragment>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
          <MdFiberManualRecord className="text-4xl"/>
        </React.Fragment>
      )
    }
};

const PinInput = ({ className }) => {
  return(
    <div className={`${className} flex flex-col align-items justify-items`}>
      <div className="flex flex-row">
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}1`)}>1</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}2`)}>2</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}3`)}>3</button>
      </div>
      <div className="flex flex-row">
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}4`)}>4</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}5`)}>5</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}6`)}>6</button>
      </div>
      <div className="flex flex-row">
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}7`)}>7</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}8`)}>8</button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}9`)}>9</button>
      </div>
      <div className="flex flex-row">
        <button className="pinpad-button" onClick={() => setPin((pin) => pin.slice(0, pin.length - 1))}><MdUndo className="p-1"/></button>
        <button className="pinpad-button" onClick={() => setPin((pin) => `${pin}0`)}>0</button>
        <button className="pinpad-button" onClick={() => setPin('')}><MdDeleteForever/></button>
      </div>
  </div>
  )
}


  return(

      <div className="fixed bg-grey-900 w-screen h-screen">

          {/* Navigation */}

          <Navigation className="fixed top-0 left-0 w-full" logout={<Logout/>} logo={<img src={craveLogoDark} className="m-2 p-2 h-12" alt="cravePOS - Intelligent Restaurant Management"/>}>

            <ul className="font-headers">

                <Link to="/">
                  <li className="button">
                    <MdHome className="menu-icon text-3xl"/>
                    <span className="menu-text">Home</span>
                  </li>
                </Link>

                <Link to="/guests">
                  <li className="button">
                    <MdAirlineSeatLegroomNormal className="menu-icon text-3xl "/>
                    <span className="menu-text">Tables</span>
                  </li>
                </Link>

                <Link to="/orders">
                  <li className="button">
                    <IoFastFoodSharp className="menu-icon text-3xl"/>
                    <span className="menu-text">Orders</span>
                  </li>
                </Link>

                <Link to="/payments">
                  <li className="button">
                    <FaCashRegister className="menu-icon text-2xl my-1"/>
                    <span className="menu-text">Payments</span>
                  </li>
                </Link>

                <Link to="/reservations">
                  <li className="button">
                    <SiGooglecalendar className="menu-icon text-2xl my-1"/>
                    <span className="menu-text">Reservations</span>
                  </li>
                </Link>

                <Link to="/user">
                  <li className="button">
                    <FaUserAlt className="menu-icon text-2xl my-1"/>
                    <span className="menu-text">User</span>
                  </li>
                </Link>

                <Link to="/settings">
                  <li className="button">
                    <FaCog className="menu-icon text-3xl pr-1 my-1"/>
                    <span className="menu-text">Settings</span>
                  </li>
                </Link>  

              </ul>

          </Navigation>


          {/* Display Window */}

          { loggedIn === true ?

            

            <main id="display" className="overflow-hidden">
              <Context.Provider value={{ user, sections, tables, menu, inventory }}>
              
                <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route path="/guests" component={Guests}/>
                  <Route path="/orders" component={Orders}/>
                  <Route path="/payments" component={Payments}/>
                  <Route path="/reservations" component={Reservations}/>
                  <Route path="/user" component={User}/>
                  <Route path="/settings" component={Settings}/>
                </Switch>
              </Context.Provider>
            </main>

          :

            <div id="login" className="flex flex-col items-center justify-center">
              <div className="flex flex-row align-items h-20">
                <PinDisplay/>
              </div>
              <PinInput className="-mb-6 -ml-16"/>  
            </div>

          }
            <ToastContainer/>
      </div>

  )
};

export default CravePOS
