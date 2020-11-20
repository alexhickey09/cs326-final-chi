document.getElementById("frankdcbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 1);
    window.location.href = "dc-todaysfood.html";
});

document.getElementById("hampdcbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 2);
    window.location.href = "dc-todaysfood.html";
});

document.getElementById("woodcbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 3);

    window.location.href = "dc-todaysfood.html";
});

document.getElementById("berkdcbutton").addEventListener('click', () => {
    window.localStorage.setItem('dc', 4);
    window.location.href = "dc-todaysfood.html";
});

document.getElementById("back-to-login").addEventListener('click', function() {
    window.location.href = "index.html";
});