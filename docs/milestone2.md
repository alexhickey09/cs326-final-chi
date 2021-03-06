# Milestone 2: 
*   ## API Planning:
    * `/login` allows users to login   
    * `/register` allows new users to signup
    * `/addfood` posts a new food to the list requires the dc, nutritional information, quantities
    * `/updatecontact` updates the contact info for the given dc
    * `/viewcontact` views contact info for given dc
    * `/makeRequest` creates a new food request and clears the current selection
    * `/viewfood` shows all available food for a dc
    * `/fulfillRequest` removes the indicated request once it is fulfilled
    * `/viewrequests` gives all current requests
    * `/selectedFood` gives the food currently being requested
    * `/addToSelection` adds the current selected food to the list of food for the current request
    
    # Major Changes to the project:


    ## 1. Create - Upon confirming the details of a food item, that food is then added to the list of available food.  
    ![image](html-file-pictures/Create-Food-1.png) \
    ![image](html-file-pictures/Create-Food-2.png) 

    

    ## 2. Read - Upon clicking the view requests button in the dc interface it gives a list of all requests with their name, time of pickup, and food requested. 
    ![image](html-file-pictures/Read-Requests.png)

     

    ## 3. Update -  When you confirm the contact details it will update the contact info on the NGO page. 
    ![image](html-file-pictures/Update-Contact-1.png) \
    ![image](html-file-pictures/Update-Contact-2.png) 

   

    ## 4. Delete - When you click the fulfill button it will remove the request from the list of requests.  
    ![image](html-file-pictures/Delete-Request-1.png) \
    ![image](html-file-pictures/Delete-Request-2.png) 

    

## Division of Labor: 
* Alex Preston: Made milestone2 doc and added endpoints and screenshots to it. Added skeleton of endpoints to server.js, implemented some endpoints, helped with various js making use of endpoints for functionality.
* Alex Hickey: Setup Heroku deployment. Setup page navigating/rerouting. Wrote the back-end server endpoints as well as front-end implementation for the following API endpoints: addfood, updatecontact, viewfood, viewcontact, addToSelection, makeRequest, viewrequests, fulfillRequest.
* Roshan Shetty: Helped with various js making use of endpoints for functionality. Made certain changes to the html files, setup.md, and milestone.md 

## Heroku Application Link: \
[https://dishsaver.herokuapp.com/](https://dishsaver.herokuapp.com/)

