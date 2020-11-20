# Milestone 3: 

# Database:
* We used a mongodb cluster and created a database which has 5 collections: `contact`, `food`, `selection`, `requests`, and `users`.
  
## Contact:
    * Stores the contact information for the Dining Commons.
    * Format: Name, Email, Phone
    * Example:
      contact document { 
          _id: <Object ID>
          name: String, //Name of contact
          email: String, //Email of contact
          phone: String, //Phone number of contact
          dc: String //DC at which contact works
      }
## Food:
    * Stores information about each food item available.
    * Format: Name, Category, Amount, Nutrition, DC
    * Example:
      food document { 
          _id: <Object ID>
          name: String, //Name of food
          category: String, //Category of food (breakfast, dinner, ...)
          amount: String, //Quantity of food available
          nutrition: String, //Nutritional information for food
          dc: String //DC at which food is available
      }
## Selection:
    * Stores the user's current selection (similar to a checkout cart)
    * Format: Array of food items containing Name, Category, Amount
    * Example:
      selection document { 
          _id: <Object ID>
          name: String, //Name of food item
          category: String, //Category of food (breakfast, dinner, ...)
          amount: String, //Quantity of food available
      }
## Requests:
    * Stores the info about the ngo and pickup as well as the food being taken.
    * Format: Name, Time, Food Array, DC
    * Example:
      contact document { 
          _id: <Object ID>
          name: String, //Name of the NGO making the request
          time: String, //Time the NGO will pickup their food
          foods: Array, //Array containing the names of all the food the NGO has selected
          dc: String //DC for which the NGO is making a request
      }
## Users:
    * Stores the email and password of registered users.
    * Format: Email, Password Array
    * Example:
      contact document { 
          _id: <Object ID>
          username: String, //Email of the registered user
          password: Array //Containing the encrypted salt and hash of the password
      }

# Division of Labor: 
* Alex Preston: Setup Login and Sign Up functionality, created and filled out milestone3.md, created final.md and added link.
* Alex Hickey: Connected MongoDB and implemented all server endpoints using MongoDB. Implement register and login functionality with MongoDB. Help with adding one contact info per DC. General QOL + stylistic improvements. Add example documents for MongoDB collections in milestone3.md.
* Alex Preston: Setup Login and Sign Up functionality, created and filled out milestone3.md, created final.md and added link, updated setup.md.
* Alex Hickey:
* Roshan Shetty: Setup the multi dc, multi contact, and multi request functionality for the dc and ngo sides. Made changes to milestone3.md.