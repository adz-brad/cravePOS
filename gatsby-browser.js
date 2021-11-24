import React from 'react';
import './src/styles/global.css';
import { MemoryRouter as Router } from 'react-router-dom'
import ContextProvider from './src/context/contextProvider';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import fetch from 'cross-fetch';
import 'react-toastify/dist/ReactToastify.min.css';
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { usePreview } from 'react-dnd-preview';


const onServiceWorkerUpdateReady = () => {
    const answer = window.confirm(
      `This application has been updated. ` +
        `Reload to display the latest version?`
    )
    if (answer === true) {
      window.location.reload()
    }
  };


const apolloLink = from([
    new HttpLink({ 
        uri: process.env.GATSBY_CRAVEDB_ENDPOINT,
        fetch
    }),
  ]);


const apolloClient = new ApolloClient ({
    link: apolloLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

const touchOptions = {
  enableMouseEvents: true,
  //delayTouchStart: 50,
  ignoreContextMenu: true,
};

const DnDPreview = () => {

  const {display, itemType, item, style } = usePreview();
  if (!display) {
    return null;
  }
  return <div className="item-list__item absolute table-size cursor-move bg-gray-500 border-2 border-gray-700 shadow-xl rounded-2xl text-xl font-semibold flex flex-row items-center justify-center" style={Object.assign({}, style)}>{item.title}</div>;
};


const wrapRootElement = ({ element }) => {
    return(
        <Router>
          <ApolloProvider client={apolloClient}>
              <ContextProvider>   
                <DndProvider backend={TouchBackend} options={touchOptions}> 
                {/*<DndProvider backend={HTML5Backend}>*/}
                  {element}
                  <DnDPreview />
                </DndProvider>
              </ContextProvider>
          </ApolloProvider>
        </Router>
    )
};

export { wrapRootElement, onServiceWorkerUpdateReady }