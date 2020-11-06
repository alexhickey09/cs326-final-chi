window.addEventListener("load", function() {
    fetch('https://dishsaver.herokuapp.com/viewrequests')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
});