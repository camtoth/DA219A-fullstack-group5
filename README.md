# Dining Dashboard (DA219A-fullstack-group5)

## [API docs (link)](https://restpoint.io/doc-runs?projectId=79bff897-19e9-4ad4-a890-e210b8f1451e&docId=SwaggerUI&x-api-key=b93acfd52c6e466d88390957a697b754)

**Comments:**

`TableID` represents one of the tables at the restaurant, and it's meant to keep track of how many should be rendered for the resturant view.

`TableInstanceID` represents an instance of that table, when it is currently being occupied (checkInTime==not null, checkOutTime==null). It has attributes, such as an assigned waiter, and has an order linked to it. This object will be archived for statistics and/or bookeeping purposes. All orders will reference one `TableInstanceID`.

## Get started
```
npm run setup
npm run start
```
