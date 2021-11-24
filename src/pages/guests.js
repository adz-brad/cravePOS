import React, { useContext, useState } from 'react';
import Context  from '../context/createContext';
import { SectionLayout } from '../components/venue';

const Guests = () => {

    const hideSourceOnDrag = true;

    const context = useContext(Context);
    const sectionList = context.sections;
    const [ tabSelected, setTabSelected ] = useState(sectionList[Object.keys(sectionList)[0]].sectionName);

    const SectionTabs = ({ className }) => {
        
        return(
            <div className={`flex flex-row items-center mx-1 ${className}`}>         
                {sectionList.map((section) => {
                    return <button key={section.sectionID} onClick={()=> setTabSelected(`${section.sectionName}`)} className={`section-tab mr-1 ${tabSelected === section.sectionName ? 'bg-gray-900' : 'bg-gray-600'}`}>{section.sectionName}</button>    
                })}
           </div>
        )
    };

    return(
        <React.Fragment>
            <SectionTabs className="w-full"/>
            <SectionLayout className="bg-gray-100 rounded-xl mt-3 ml-1 shadow-md" hideSourceOnDrag={hideSourceOnDrag} section={tabSelected} />
        </React.Fragment>
    )
};

export default Guests

