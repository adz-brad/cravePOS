# cravePOS
### React-based Point-of-sale Web App

### Built with:

- GatsbyJS
- Apollo GraphQL Client
- React Drag N Drop
- TailwindCSS
- Any headless CMS option (demo built around GraphCMS models)
- Any transaction handler (Strip, Square)

### Overview

CravePOS is designed to work in conjunction with other Crave restaurant management suite applications to streamline restaurant management operations. This is accomplished using a NodeJS application, [craveDB](https://github.com/brad-nst/craveDB-electron), which spins up a local Apollo GraphQL server that performs CRUD operations to a local instance of MongoDB Realm, which is synced to the restaurant's cloud database. This design allows the point-of-sale unit to function offline via CRUD operations to the local server while asynchronously updating the cloud where data can be fetched remotely by other applications in the suite, allowing for live inventory management and live business metric visualization.

### Features

Designed to work with any headless CMS option, the POS system can handle menu management, reservation management, custom transaction handling and additional integrations for any custom features required by the client. Ideally, businesses will integrate the menu and reservation system directly into their website allowing guests to always view the most updated menu options as well as make reservations on their own while syncing directly to the management system.

### How It Works

#### User Authentication

When connected to the local instance of [craveDB](https://github.com/brad-nst/craveDB-electron), users are authenticated with a pin code referenced against user entries in the database. After auth is handled, users can tab through venue sections to view active tables, add new tables or, if they have manager-level permissions, modify venue layouts.

<img src="https://www.upwork.com/att/download/portfolio/persons/uid/1168350970322448384/profile/projects/files/a7d2a8b8-d618-4b94-a4e0-747d7a223eb6" height="300">

#### Guest / Order Management

When an active table has been selected, users may add/remove guests as well as modify their orders and process their payments. Once orders are placed, they are sent to the kitchen where the craveKDS (kitchen display system) will render a notification to the staff and add the order to an "In Queue" list. Kitchen staff can accept the order, which moves it to the "In Progress" list. Once the order is ready for service, the kitchen staff marks it "Ready" and a notification is sent to the POS device, allowing service staff to see in real-time when orders are ready to be taken to the appropriate table. Once orders have been served, service staff can mark them "Served". The purpose of this is for management to visualize where service quality can be improved by identifying when excess time is being spent during the order process.

<img src="https://www.upwork.com/att/download/portfolio/persons/uid/1168350970322448384/profile/projects/files/fb42a16e-c34a-45b7-b5c0-1edeeec4e2f5" height="300">

#### Transaction Handling

Once guests are finished with their service and it's time to process payments, the server can split bills multiple ways as well as apply discounts. To handle transactions, the POS is ideally designed to work with modern payment integrations like Stripe or Square, however businesses that wish to use existing hardware can request to have integrations built for their specific equipment. Once the transaction is approved, the guest's balance is cleared and the server can either remove them from the table if they are leaving, or place new orders if they choose to stay.

<img src="https://www.upwork.com/att/download/portfolio/persons/uid/1168350970322448384/profile/projects/files/a2936bfc-f5b4-4c52-a1a2-337348ef14b9" height="300">


