function init(player, Op) {
    //Creating and defining the canvas 
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");
    //Defining the board list
    let board = [];
    //Defining the amount of spaces
    const col = 3;
    const row = 3;
    //Defining the size of squares (as an interval between lines)
    const SI = 150;
    // Adding image sources
    const Xtile = new Image();
    Xtile.src = "Images/Xtile150.png";
    const Otile = new Image();
    Otile.src = "Images/Otile150.png";
    //all possible wins
    const winPos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    //Game continues 
    let GO = false;
    let GD = new Array(9); //game data 
    let CPlayer = player.human; //set the current player (tbc)

    function drawBoard() {
        let pos = 0;
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < col; j++) {
                board[i][j] = pos;
                ctx.strokeStyle = "#FFF";
                ctx.strokeRect(j * SI, i * SI, SI, SI);
                pos++;
            }
        }
    }
    drawBoard();


    //Finding the board space clicked by flooring the positions
    canvas.addEventListener("click", function (event) {
        if (GO) return;
        //Finds click
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;
        //Finds which space its in (Axis/SpaceInterval) and rounds down
        let i = Math.floor(Y / SI);
        let j = Math.floor(X / SI);
        //Finds space
        let pos = board[i][j];
        //prevents a repeated place
        if (GD[pos]) return;
        //Stores move
        GD[pos] = CPlayer;
        console.log(GD);
        //Add move to canvas 
        drawEdit(CPlayer, i, j);
        //Endgame checks
        if (isWin(GD, CPlayer)) {
            showGO(CPlayer);
            GO = true;
            return;
        }
        if (isTie(GD)) {
            showGO("tie");
            GO = true;
            return;
        }
        if (Op == "computer") {
            let pos = minimax(GD, player.computer).pos;

            GD[pos] = player.computer;
            console.log(GD);

            let clickSpace = getClicked(pos);

            drawEdit(player.computer, clickSpace.clickI, clickSpace.clickJ);

            if (isWin(GD, player.computer)) {
                showGO(player.computer);
                GO = true;
                return;
            }
            if (isTie(GD)) {
                showGO("tie");
                GO = true;
                return;
            } 
        }else {
            CPlayer = CPlayer == player.human ? player.friend : player.human;
        }
        
    });
    //minimax
    function minimax(GD, User) {
        if (isWin(GD, player.computer)) return {
            try: +10
        };
        if (isWin(GD, player.human)) return {
            try: -10
        };
        if (isTie(GD)) return {
            try: 0
        };

        let ES = getSpace(GD);
        let avMove = [];

        for (let i = 0; i < ES.length; i++) {
            let pos = ES[i];
            let store = GD[pos];
            GD[pos] = User

            let rMove = {};
            rMove.pos = pos

            if (User == player.computer) {
                rMove.try = minimax(GD, player.human).try;
            } else {
                rMove.try = minimax(GD, player.computer).try;
            }

            GD[pos] = store;
            avMove.push(rMove);
        }

        let bMove;
        if (User == player.computer) {
            bTry = -Infinity;
            for (let i = 0; i < avMove.length; i++) {
                if (avMove[i].try > bTry) {
                    bTry = avMove[i].try;
                    bMove = avMove[i];
                }
            }
        } else {
            bTry = +Infinity;
            for (let i = 0; i < avMove.length; i++) {
                if (avMove[i].try < bTry) {
                    bTry = avMove[i].try;
                    bMove = avMove[i];
                }
            }
        }
        return bMove;
    }
    function getSpace(GD) {
        let clear = []

        for (let pos = 0; pos < GD.length; pos++) {
            if (!GD[pos]) clear.push(pos);
        }
        return clear
    }

    function getClicked(pos) {
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++) {
                if(board[i][j] == pos) return{clickI : i, clickJ : j}
            }
        }
    }
        //checks for wins
    function isWin(GD, player) {
        for (let i = 0; i < winPos.length; i++) {
            let won = true;
            for (let j = 0; j < winPos[i].length; j++) {
                let pos = winPos[i][j];
                won = GD[pos] == player && won;
            }
            if (won) {
                return true;
            }
        }
        return false;
    }

        //checks for ties 
    function isTie(GD) {
        let isFull = true;

        for (let i = 0; i < GD.length; i++) {
            isFull = GD[i] && isFull;
        }
        if (isFull) {
            return true;
        }
        return false;
    }

    function showGO(player) {
        let Src = `Images/${player}tile.png`;
        let message = player == "tie" ? "Tie" : "Win";
        GOElement.innerHTML = `
            <h1>${message}</h1>
            <img class="W-img" src=${Src} ></img> 
            <div class="play" onclick="location.reload();">Reset</div>
        `;
    GOElement.classList.remove("hide");
    }

    // deciding and drawing images on position
    function drawEdit(player, i, j) {
        const Image = player == "X" ? Xtile : Otile;
        ctx.drawImage(Image, j * SI, i * SI);
    }
}