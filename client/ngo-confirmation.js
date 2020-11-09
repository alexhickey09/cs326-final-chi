window.addEventListener("load", function() {
    fetch('./selectedFood')
        .then(response => response.json())
        .then(data => {
            //Making the table and the header row
            const table = document.querySelector("table");
            const thead = table.createTHead();
            const header = thead.insertRow();
            
            const nameHead = document.createElement("th");
            nameHead.classList.add("infocol");
            const nameHeadText = document.createTextNode("Name");
            nameHead.appendChild(nameHeadText);
            header.appendChild(nameHead);

            const categoryHead = document.createElement("th");
            categoryHead.classList.add("infocol");
            const categoryHeadText = document.createTextNode("Category");
            categoryHead.appendChild(categoryHeadText);
            header.appendChild(categoryHead);

            const amountHead = document.createElement("th");
            amountHead.classList.add("infocol");
            const amountHeadText = document.createTextNode("Amount");
            amountHead.appendChild(amountHeadText);
            header.appendChild(amountHead);

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

document.getElementById("back-to-food-select").addEventListener('click', function() {
    window.location.href = "ngo-select-food.html";
});


document.getElementById("submitreq").addEventListener('click', async function() {
    let arr = [];
    await fetch('./selectedFood')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                arr.push(data[i].name);
            }
        });
    
    const request = [document.getElementById("ngo-name").value, document.getElementById("pickuptime").value, arr];
    console.log(request);


    fetch('./makeRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request),
    });
});