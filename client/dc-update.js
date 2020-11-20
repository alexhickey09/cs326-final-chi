window.addEventListener("load", function () {
    fetch('/viewcontact?dc=' + window.localStorage.getItem('dc'))
        .then(response => response.json())
        .then(data => {
            const contactInfo = document.createElement("h2");
            contactInfo.classList.add("DC");
            contactInfo.innerHTML = "Current Manager Contact Info";
            document.body.appendChild(contactInfo);

            const name = document.createElement("div");
            name.classList.add("DC");
            name.innerHTML = data.name;
            document.body.appendChild(name);

            const email = document.createElement("div");
            email.classList.add("DC");
            email.innerHTML = data.email;
            document.body.appendChild(email);

            const phone = document.createElement("div");
            phone.classList.add("DC");
            phone.innerHTML = data.phone;
            document.body.appendChild(phone);
            
        });
});

document.getElementById("update-contact-button").addEventListener('click', function() {
    const contact = {"name": document.getElementById("name").value,
                     "email": document.getElementById("email").value,
                     "phone": document.getElementById("phone").value,
                     "dc": window.localStorage.getItem("dc"),
                    };


    fetch('./updatecontact', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(contact),
    });
});

document.getElementById("back-to-food").addEventListener('click', function() {
    window.location.href = "dc-todaysfood.html";
});