const options = document.querySelector(".options");
const GOElement = document.querySelector(".gameover");

const CBtn = options.querySelector(".computer");
const FBtn = options.querySelector(".player");
const XBtn = options.querySelector(".x");
const OBtn = options.querySelector(".o");
const PBtn = options.querySelector(".play");

let Op;
const player = new Object;



XBtn.addEventListener("click", function(){
    player.human = "X";
    player.computer = "O";
    player.friend = "O";
    toggle(OBtn, XBtn);
});
OBtn.addEventListener("click", function(){
    player.human = "O";
    player.computer = "X";
    player.friend = "X";
    toggle(XBtn, OBtn);
});
CBtn.addEventListener("click", function(){
    Op = "computer";
    toggle(FBtn, CBtn);

});
FBtn.addEventListener("click", function(){
    Op = "friend";
    toggle(CBtn, FBtn);

});

PBtn.addEventListener("click", function(){
    if(!Op){
        CBtn.style.backgroundColor = "#FFF";
        FBtn.style.backgroundColor = "#FFF";
        CBtn.style.color = "#212529";
        FBtn.style.color = "#212529";
        return;
    }
    if(!player.human){
        XBtn.style.backgroundColor = "#FFF";
        OBtn.style.backgroundColor = "#FFF";
        XBtn.style.color = "#212529";
        OBtn.style.color = "#212529";
        return;
    }
    init(player, Op);
    options.classList.add("hide");
});
function toggle(off, on){
    off.classList.remove("on");
    on.classList.add("on");
}

