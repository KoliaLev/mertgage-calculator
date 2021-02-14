var modalLogin = document.getElementById("id01");
var modalCalculator = document.getElementById("id02");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalLogin) {
    modalLogin.style.display = "none";
    console.log(event.target);
  }
  if (event.target == modalCalculator) {
    modalCalculator.style.display = "none";
    console.log(event.target);
  }
};
