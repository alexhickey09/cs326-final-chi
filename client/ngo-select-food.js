window.addEventListener("load", function() {
    let table = document.querySelector("table");
    let thead = table.createTHead();
    let header = thead.insertRow();
    
    let nameHead = document.createElement("th");
    let nameHeadText = document.createTextNode("Name");
    nameHead.appendChild(nameHeadText);
    header.appendChild(nameHead);

    let categoryHead = document.createElement("th");
    let categoryHeadText = document.createTextNode("Category");
    categoryHead.appendChild(categoryHeadText);
    header.appendChild(categoryHead);

    let amountHead = document.createElement("th");
    let amountHeadText = document.createTextNode("Amount");
    amountHead.appendChild(amountHeadText);
    header.appendChild(amountHead);
   

    fetch('https://dishsaver.herokuapp.com/viewfood')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            for(let i = 0; i < data.length; i++) {
                let row = table.insertRow();

                let name = row.insertCell();
                let nameText = document.createTextNode(data[i].name);
                name.appendChild(nameText);

                let category = row.insertCell();
                let categoryText = document.createTextNode(data[i].category);
                category.appendChild(categoryText);

                let amount = row.insertCell();
                let amountText = document.createTextNode(data[i].amount);
                amount.appendChild(amountText);
            }
        });
})