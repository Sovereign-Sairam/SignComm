const toggleBtn = document.querySelector('.toggle_btn');
const navbar = document.querySelector('.navbar');
const learnMore = document.querySelector('#LearnMoreBtn');
const heroPara = document.querySelector('.heroPara');
const profile = document.getElementById("profile");
const profileImg = document.getElementById("profileContainer");
toggleBtn.addEventListener('click',function(){
    navbar.classList.toggle('open');
})
profile.addEventListener("click",function(){
    profileImg.classList.toggle('toggle');
})


