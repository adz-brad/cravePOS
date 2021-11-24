import { gql } from '@apollo/client';

const getBooks = gql`
query GetBooks {
  books {
    title
    author
  }
}
`;

const getUsers = gql`
    query {
        getAllUsers {
            userID
            name
            pin
            accessLevel
        }
    }
`;


const getSections = gql`
  query {
    getAllSections {
      sectionID
      sectionName
    }
  }
`;

const getMenu = gql`
  query {
    getAllMenus {
      menuID
      menuName
      categories {
        categoryID
        categoryName
        menuItems {
          menuItemID
          name
          price
          description
          showInMenu
          featured
          featuredPrice
          allowMods
          modifiers {
            subs {
              type
              name
              priceChange
              quantity
              ingredients {
                ingredientID
                type
                name
                quantity
                unit
                allowSubs
              }
            }
            sizes {
              size
              ratio
            }
            sides {
              name
              priceChange
              quantity
              ingredients {
                ingredientID
                type
                name
                quantity
                unit
                allowSubs
              }
            }
            notes
          }
          ingredients {
            ingredientID
            type
            name
            quantity
            inventoryQuantity
            unit
            addonPrice
            allowSubs
          }
        }
      }
    }
  }
`;

const getInventory = gql`
  query {
    getAllInventory {
      inventoryID
      itemType
      name
      quantity
      unit
      unitCost
      unitPrice
      updatedAt
    }
  }
`;

const getTableByID = gql`
  query($tableID: String) {
    getTableByID(tableID: $tableID){
      tableID
      tableNumber
      section
      layoutPositionX
      layoutPositionY
      service {
        serviceID
        currentServer
        openedAt
        openedBy
        closedAt
        closedBy
        transferedAt
        transferedBy
        transferedTo
        seats {
          seatID
          seatNumber
          openedAt
          closedAt
          orders {
            tableID
            seatID
            orderID
            orderNumber
            orderStatus
            inputBy
            orderedAt
            acceptedAt
            readyAt
            servedAt
            orderItems {
              orderItemID
              name
              price
              quantity
              ingredients{
                ingredientID
                type
                name
                inventoryQuantity
              }
              size
              subs {
                name
              }
              sides {
                name
              }
              notes
            }
          }
        }
      }
    }
  }
`;

const getTablesBySection = gql`
  query($section: String) {
    getTablesBySection(section: $section){
      tableID
      tableNumber
      section
      layoutPositionX
      layoutPositionY
      service {
        serviceID
        currentServer
        openedAt
        openedBy
        closedAt
        closedBy
        transferedAt
        transferedBy
        transferedTo
        seats {
          seatID
          seatNumber
          openedAt
          closedAt
          orders {
            tableID
            seatID
            orderID
            orderNumber
            orderStatus
            inputBy
            orderedAt
            acceptedAt
            readyAt
            servedAt
            orderItems {
              orderItemID
              name
              price
              quantity
              ingredients{
                ingredientID
                type
                name
                inventoryQuantity
              }
              size
              subs {
                name
              }
              sides {
                name
              }
              notes
            }
          }
        }
      }
    }
  }
`;

const getTables = gql`
  query {
    getAllTables {
      tableID
      tableNumber
      section
      layoutPositionX
      layoutPositionY
      service {
        serviceID
        currentServer
        openedAt
        openedBy
        closedAt
        closedBy
        transferedAt
        transferedBy
        transferedTo
        seats {
          seatID
          seatNumber
          openedAt
          closedAt
          orders {
            tableID
            seatID
            orderID
            orderNumber
            orderStatus
            inputBy
            orderedAt
            acceptedAt
            readyAt
            servedAt
            orderItems {
              orderItemID
              name
              price
              quantity
              ingredients{
                ingredientID
                type
                name
                inventoryQuantity
              }
              size
              subs {
                name
              }
              sides {
                name
              }
              notes
            }
          }
        }
      }
    }
  }
`;



export { getBooks, getUsers, getSections, getTableByID, getTablesBySection, getTables, getMenu, getInventory }