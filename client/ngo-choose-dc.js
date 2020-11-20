document.getElementById("frankbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 1);
    window.location.href = "ngo-select-food.html";
});

document.getElementById("hampbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 2);
    window.location.href = "ngo-select-food.html";
});

document.getElementById("woobutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 3);
    window.location.href = "ngo-select-food.html";
});

document.getElementById("berkbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 4);
    window.location.href = "ngo-select-food.html";
});

document.getElementById("back-to-login").addEventListener('click', function() {
    window.location.href = "index.html";
});