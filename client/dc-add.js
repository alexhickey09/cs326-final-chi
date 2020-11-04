document.getElementById("addfoodbutton").addEventListener('click', async function() {
    const foodItem = {"name": document.getElementById("name"),
                      "category": document.getElementById("category"),
                      "amount": document.getElementById("amount"),
                      "nutrition": document.getElementById("nutrition")};

    fetch('http://localhost:8080/wordScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(foodItem),
    });
});