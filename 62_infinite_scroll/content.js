var innards = document.body.innerHTML;
document.body.innerHTML += innards;

$(window).scroll(function (e){
  if ($(document).height() < $(window).scrollTop() + $(window).height() * 10){
    document.body.innerHTML += innards;
  }
});