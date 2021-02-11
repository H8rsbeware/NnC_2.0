const options = document.querySelector(".options"); //Gets all of the classes of html items
const GOElement = document.querySelector(".gameover");
const CBtn = options.querySelector(".computer");
const FBtn = options.querySelector(".player");
const XBtn = options.querySelector(".x");
const OBtn = options.querySelector(".o");
const PBtn = options.querySelector(".play");
let Op; //Defines the opponent
const player = new Object; // Makes the player object, with the properties computer, friend, and human
let muted
//Sounds


let select = document.getElementById("select");
let start = document.getElementById("start")
let error = document.getElementById("error")

const mute = document.querySelector(".mute");
const target = document.querySelector(".fas")
mute.addEventListener("click",function(){
    if(target.classList.contains("fa-volume-up")){
        select.volume = 0
        start.volume = 0
        error.volume = 0
        muted = true

        target.classList.remove("fa-volume-up")
        target.classList.add("fa-volume-mute")
    }else{
        select.volume = 1
        start.volume = 1
        error.volume = 1
        muted = false

        target.classList.remove("fa-volume-mute")
        target.classList.add("fa-volume-up")
        
    }
})



XBtn.addEventListener("click", function(){
    player.human = "X"; player.computer = "O"; player.friend = "O"; //Sets the markers for each player
    toggle(OBtn, XBtn); //Changes the button colours
    select.play();
});
OBtn.addEventListener("click", function(){
    player.human = "O"; player.computer = "X"; player.friend = "X";
    toggle(XBtn, OBtn);
    select.play();
});
CBtn.addEventListener("click", function(){
    Op = "computer";    //Sets the opponent to ai
    toggle(FBtn, CBtn);
    select.play();
});
FBtn.addEventListener("click", function(){
    Op = "friend"; //Sets the oppenent to another player
    toggle(CBtn, FBtn);
    select.play();
});

PBtn.addEventListener("click", function(){
    if(!Op){
        CBtn.style.backgroundColor = "#41444b"; FBtn.style.backgroundColor = "#41444b"; //Highlights if no option selected
        CBtn.style.color = "#212529"; FBtn.style.color = "#212529";
        error.play()
        return;
    }
    if(!player.human){
        XBtn.style.backgroundColor = "#41444b"; OBtn.style.backgroundColor = "#41444b"; //Highlights if no option selected
        XBtn.style.color = "#212529"; OBtn.style.color = "#212529";
        error.play()
        return;
    }
    start.play();
    init(player, Op, muted);
    options.classList.add("hide"); //Initiates game and hide the settings
});
function toggle(off, on){
    off.classList.remove("on"); //Makes the button colour change
    on.classList.add("on"); //Stops both being active at once
}


