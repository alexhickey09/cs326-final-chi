document.getElementById("addfoodbutton").addEventListener('click', async function() {
    const foodItem = {"name": document.getElementById("name").value,
                      "category": document.getElementById("category").value,
                      "amount": document.getElementById("amount").value,
                      "nutrition": document.getElementById("nutrition").value};

    fetch('https://dishsaver.herokuapp.com/addfood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(foodItem),
    });
});