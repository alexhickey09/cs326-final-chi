document.getElementById("back-to-food").addEventListener('click', function() {
    window.location.href = "dc-todaysfood.html";
});

window.addEventListener("load", function() {
    const table = document.querySelector("table");
    const thead = table.createTHead();
    const header = thead.insertRow();
    
    const nameHead = document.createElement("th");
    nameHead.classList.add("namecol");
    const nameHeadText = document.createTextNode("NGO Name");
    nameHead.appendChild(nameHeadText);
    header.appendChild(nameHead);

    const categoryHead = document.createElement("th");
    categoryHead.classList.add("pickupcol");
    const categoryHeadText = document.createTextNode("Pickup Time");
    categoryHead.appendChild(categoryHeadText);
    header.appendChild(categoryHead);

    const amountHead = document.createElement("th");
    amountHead.classList.add("foodcol");
    const amountHeadText = document.createTextNode("Foods Requested");
    amountHead.appendChild(amountHeadText);
    header.appendChild(amountHead);

    const selectHead = document.createElement("th");
    selectHead.classList.add("selectcol");
    const selectHeadText = document.createTextNode("Select");
    selectHead.appendChild(selectHeadText);
    header.appendChild(selectHead);
    
    fetch('/viewrequests?dc=' + window.localStorage.getItem('dc'))
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                const row = table.insertRow();

                const name = row.insertCell();
                const nameText = document.createTextNode(data[i].name);
                name.appendChild(nameText);

                const time = row.insertCell();
                const timeText = document.createTextNode(data[i].time);
                time.appendChild(timeText);

                const amount = row.insertCell();
                const foods = data[i].foods;
                const foodsString = foods.join(", ");
                const amountText = document.createTextNode(foodsString);
                amount.appendChild(amountText);

                const select = row.insertCell();
                select.type = "button";
                select.className = "btn btn-secondary";
                select.innerHTML = "Fullfil";
                select.onclick = (function selectFood() {
                    fetch('./fulfillRequest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({name: data[i].name}), //Passes in the name of the NGO making the request
                    });
                });
            }
        });
});