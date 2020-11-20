document.getElementById("addfoodbutton").addEventListener('click', async function() {
    const foodItem = {"name": document.getElementById("name").value,
                      "category": document.getElementById("category").value,
                      "amount": document.getElementById("amount").value,
                      "nutrition": document.getElementById("nutrition").value,
                      "dc": window.localStorage.getItem("dc"),
                    };

    fetch('./addfood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(foodItem),
    });
    window.location.href = "dc-todaysfood.html";
});

document.getElementById("back-to-food").addEventListener('click', function() {
    window.location.href = "dc-todaysfood.html";
});