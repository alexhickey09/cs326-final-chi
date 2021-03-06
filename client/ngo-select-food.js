window.addEventListener("load", function() {   
    //Making an additional row for each food item that has been listed
    fetch('/viewfood?dc=' + window.localStorage.getItem('dc'))
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
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

                const selectHead = document.createElement("th");
                selectHead.classList.add("selectcol");
                const selectHeadText = document.createTextNode("Select");
                selectHead.appendChild(selectHeadText);
                header.appendChild(selectHead);
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

                    const select = row.insertCell();
                    select.type = "button";
                    select.className = "btn btn-secondary";
                    select.innerHTML = "Select";
                    select.onclick = (function selectFood() {
                        const selection = {
                            name: data[i].name,
                            category: data[i].category,
                            amount: data[i].amount
                        };
                        fetch('./addToSelection', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            body: JSON.stringify(selection),
                        });
                    });
                }
            }
            else {
                document.getElementById("no-food").innerHTML = "Sorry, there is currently no food listed. Please check back later.";
            }
        });

    fetch('/viewcontact?dc=' + window.localStorage.getItem('dc'))
        .then(response => response.json())
        .then(data => {
            const contactInfo = document.createElement("h2");
            contactInfo.innerHTML = "Manager Contact Info";
            document.body.appendChild(contactInfo);

            const name = document.createElement("div");
            name.innerHTML = data.name;
            document.body.appendChild(name);

            const email = document.createElement("div");
            email.innerHTML = data.email;
            document.body.appendChild(email);

            const phone = document.createElement("div");
            phone.innerHTML = data.phone;
            document.body.appendChild(phone);
            
        });
});
document.getElementById("view-selection-button").addEventListener('click', () => {
    window.location.href = "ngo-confirmation.html";
});

document.getElementById("back-to-ngo-choose").addEventListener('click', function() {
    window.location.href = "ngo-choose-dc.html";
});