document.getElementById("back-to-food").addEventListener('click', function() {
    window.location.href = "dc-todaysfood.html";
});

window.addEventListener("load", function() {
    fetch('https://dishsaver.herokuapp.com/viewrequests')
        .then(response => response.json())
        .then(data => {
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