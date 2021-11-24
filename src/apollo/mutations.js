import { gql } from '@apollo/client';


const createTable = gql`
  mutation($tableID: String, $section: String, $tableNumber: Int, $layoutPositionX: Float, $layoutPositionY: Float, $service: ServiceInput) {
    createTable(tableID: $tableID, section: $section, tableNumber: $tableNumber, layoutPositionX: $layoutPositionX, layoutPositionY: $layoutPositionY, service: $service){
      tableID
      tableNumber
      section
      layoutPositionX
      layoutPositionY
    }
  }
`;

const deleteTable = gql`
  mutation($tableID: String) {
    deleteTable(tableID: $tableID){
      tableID
    }
  }
`;

const updateTable = gql`
  mutation($tableID: String, $service: ServiceInput) {
    updateTable(tableID: $tableID, service: $service)
    tableID
  }
`;

const updateTablePosition = gql`
  mutation($tableID: String, $layoutPositionX: Float, $layoutPositionY: Float) {
    updateTablePosition(tableID: $tableID, layoutPositionX: $layoutPositionX, layoutPositionY: $layoutPositionY) {
      tableID
      layoutPositionX
      layoutPositionY
    }
  }
`;

const createSeat = gql`
  mutation($tableID: String, $seats: [SeatInput]) {
    createSeat(tableID: $tableID, seats: $seats) {
      seatID
      seatNumber
      openedAt
    }
  }
`;

const deleteSeat = gql`
  mutation($tableID: String, $seatID: String){
    deleteSeat(tableID: $tableID, seatID: $seatID){
      seatID
    }
  }
`;

const createSeatOrder = gql`
  mutation($tableID: String, $seatID: String, $orders: [OrderInput]){
    createSeatOrder(tableID: $tableID, seatID: $seatID, orders: $orders){
      orderID
      orderItems{
        name
      }
    }
  }
`;

const updateSeatOrder = gql`
  mutation($tableID: String, $seatID: String, $orderID: String, $orders: [OrderInput]){
    updateSeatOrder(tableID: $tableID, seatID: $seatID, orderID: $orderID, orders: $orders){
      orderID
      orderStatus
    }
  }
`;

const deleteSeatOrder = gql`
  mutation($tableID: String, $seatID: String, $orderID: String){
    deleteSeatOrder(tableID: $tableID, seatID: $seatID, orderID: $orderID){
      orderID
    }
  }
`;

const deleteSeatOrderItem = gql`
  mutation($tableID: String, $seatID: String, $orderID: String, $orderItemID: String){
    deleteSeatOrder(tableID: $tableID, seatID: $seatID, orderID: $orderID, orderItemID: $orderItemID){
      orderItemID
    }
  }
`;


export { 
  createTable, 
  updateTablePosition, 
  deleteTable, 
  updateTable, 
  createSeat, 
  deleteSeat,
  createSeatOrder,
  updateSeatOrder,
  deleteSeatOrder,
  deleteSeatOrderItem,
 };