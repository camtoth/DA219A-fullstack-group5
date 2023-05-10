# Dining Dashboard (DA219A-fullstack-group5)

## [API docs (link)](https://restpoint.io/doc-runs?projectId=79bff897-19e9-4ad4-a890-e210b8f1451e&docId=SwaggerUI&x-api-key=b93acfd52c6e466d88390957a697b754)

**Comments:**

`TableID` represents one of the tables at the restaurant, and it's meant to keep track of how many should be rendered for the restaurant view.

`TableInstanceID` represents an instance of that table, when it is currently being occupied (checkInTime==not null, checkOutTime==null). It has attributes, such as an assigned waiter, and has an order linked to it. This object will be archived for statistics and/or bookeeping purposes. All orders will reference one `TableInstanceID`.

## Get started
```
npm run setup
npm run start
```

## CRUD API

### Tables

Get      /api/tables/ - Get all tables

Post     /api/tables/ - Create a new table

Put      /api/tables/:id - Update a table by id

Delete   /api/tables/:id - Delete by id


### Accounts

Get      /api/accounts/ - Get all accounts

Post     /api/accounts/ - Create a new account

Put      /api/accounts/:id - Update a account by id

Delete   /api/accounts/:id - Delete by id


### Menu Items

Get      /api/menuItems/ - Get all menuItems

Post     /api/menuItems/ - Create a new menuItem

Put      /api/menuItems/:id - Update a menuItem by id

Delete   /api/menuItems/:id - Delete by id


### Occupations

Get      /api/occupations/ - Get all occupation

Post     /api/occupations/ - Create a new occupation 
You need only tableID and waiterID to create an occupation and the rest of the fields have default values.

Put      /api/occupations/:id - Update a occupation by id

!But it does not update the orders attached to the occupation

Delete   /api/occupations/:id - Delete by id


## Authors
* [Stephan Hek](https://github.com/Stephan0027)
* [Hiva Hojjati Moghaddam](https://github.com/hivaww)
* [Cameron Tóth](https://github.com/camtoth)
* [Yana Zlatanova](https://github.com/yanazlatanova)
