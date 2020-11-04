document.getElementById("update-contact-button").addEventListener('click', function() {
    const contact = {"name": document.getElementById("name").value,
                     "email": document.getElementById("email").value,
                     "phone": document.getElementById("phone").value};

    fetch('https://dishsaver.herokuapp.com/updatecontact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(contact),
    });
});