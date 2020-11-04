window.addEventListener("load", function() {
    const table = document.querySelector("table");
    const thead = table.createTHead();
    const header = thead.insertRow();
    
    const nameHead = document.createElement("th");
    const nameHeadText = document.createTextNode("Name");
    nameHead.appendChild(nameHeadText);
    header.appendChild(nameHead);

    const categoryHead = document.createElement("th");
    const categoryHeadText = document.createTextNode("Category");
    categoryHead.appendChild(categoryHeadText);
    header.appendChild(categoryHead);

    const amountHead = document.createElement("th");
    const amountHeadText = document.createTextNode("Amount");
    amountHead.appendChild(amountHeadText);
    header.appendChild(amountHead);
   

    fetch('https://dishsaver.herokuapp.com/viewfood')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            for(let i = 0; i < data.length; i++) {
                const row = table.insertRow();

                const name = row.insertCell();
                const nameText = document.createTextNode(data[i].name);
                name.appendChild(nameText);

                const category = row.insertCell();
                const categoryText = document.createTextNode(data[i].category);
                category.appendChild(categoryText);

                const amount = row.insertCell();
                const amountText = document.createTextNode(data[i].amount);
                amount.appendChild(amountText);
            }
        });
});
document.getElementById("view-selection-button").addEventListener('click', () => {
    window.location.href = "ngo-confirmation.html";
});