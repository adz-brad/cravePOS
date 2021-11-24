import { useQuery } from '@apollo/client';
import { getBooks, getUsers, getSections, getMenu, getInventory, getTables, getTableByID, getTablesBySection } from './queries';

function GetBooks() {
  const { data: bookData } = useQuery(getBooks, {
      pollInterval: 500
    });
  return bookData;
};


function GetUsers() {
    const { data: userData } = useQuery(getUsers, {
        pollInterval: 500
      });
    return userData;
};

function GetSections() {
  const { data: sectionData } = useQuery(getSections, {
    pollInterval: 500
  });
  return sectionData;
};

function GetTables() {
  const { data: tableData } = useQuery(getTables, {
    pollInterval: 500
  });
  return tableData;
};

function GetMenu() {
  const { data: menuData } = useQuery(getMenu, {
    pollInterval: 500
  });
  return menuData;
};

function GetInventory() {
  const { data: inventoryData } = useQuery(getInventory, {
    pollInterval: 500
  });
  return inventoryData;
};

function GetTableByID(tableID) {
  const { data: tableData } = useQuery(getTableByID, {
    pollInterval: 500,
    variables: { tableID: String(tableID) }
  });
  return tableData;
};

function GetTablesBySection(section) {
  const { data: tableData } = useQuery(getTablesBySection, {
    pollInterval: 500,
    variables: { section: String(section) }
  });
  return tableData;
};


export { GetBooks, GetUsers, GetSections, GetTables, GetTableByID, GetTablesBySection, GetMenu, GetInventory };







