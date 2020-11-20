Database:
* We used a mongodb cluster.
* The database has 4 collections: contact, food, requests, and users.
* Contact:
    * Stores the contact information for the Dining Commons.
    * Format: Name, Email, Phone
* Food:
    * Stores information about each food item available.
    * Format: Name, Category, Amount, Nutrition, DC
* Requests:
    * Stores the info about the ngo and pickup as well as the food being taken.
    * Format: Name, Time, Food Array, DC
* Users:
    * Stores the email and password of registered users.
    * Format: Email, Password Array

Division of Labor:
* Alex Preston: Setup Login and Sign Up functionality, created and filled out milestone3.md, created final.md and added link.
* Alex Hickey:
* Roshan Shetty: