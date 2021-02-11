function init(player, Op, muted) {
    //Creating and defining the canvas 
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");
    //Defining the board list
    let board = [];
    //all possible wins
    const winPos = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];
    //Defining the amount of spaces
    const col = 3;
    const row = 3;
    const SI = 150;
    //Game continues 
    let GO = false;
    let GD = new Array(9); //game data 
    let CPlayer = player.human; //set the current player

    function drawBoard() { //Draws board in canvas
        let pos = 0;
        for (let i = 0; i < row; i++) { //For each row
            board[i] = [];  //That position is set to empty
            for (let j = 0; j < col; j++) { //For each colomn
                board[i][j] = pos; //board coords are set to position
                ctx.strokeStyle = "#FFF"; 
                ctx.strokeRect(j * SI, i * SI, SI, SI); //Its drawn
                pos++; //Position is increased
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
        if (isWin(GD, CPlayer)) { //If the called function returns true
            showGO(CPlayer); //End screen function is called with the winner
            GO = true; //The game is ended
            return;
        }
        if (isTie(GD)) {//Same basic premise but for a tie
            showGO("tie");
            GO = true;
            return;
        }
        //All of the above is for the main player

        //All of the below is for the second player
        if (Op == "computer") { //Checks if the player asks for algorithm
            let pos = minimax(GD, player.computer).pos; //If it is, then minimax is initated

            GD[pos] = player.computer;
            console.log(GD);

            let clickSpace = getClicked(pos); //Gets the computers clicked space

            drawEdit(player.computer, clickSpace.clickI, clickSpace.clickJ); //Draws the minimax returned move

            if (isWin(GD, player.computer)) { //Win and tie are same as main player
                showGO(player.computer); //Feed the computer tile instead of the main players
                GO = true;
                return;
            }
            if (isTie(GD)) {
                showGO("tie");
                GO = true;
                return;
            } 
        }else { //If not AI, the player is simply changed to the opposite human, who plays the same at the main player
            CPlayer = CPlayer == player.human ? player.friend : player.human;
        }
        
    });
    //minimax !RECURSION
    function minimax(GD, User) {
        if (isWin(GD, player.computer)) return {try: +100}; //Checks the game data returned last run for wins or ties
        if (isWin(GD, player.human)) return {try: -100};
        if (isTie(GD)) return {try: 0};

        let ES = getSpace(GD); //Gets all empty spaces after last runs game data 
        let avMove = []; 

        for (let i = 0; i < ES.length; i++) {
            let pos = ES[i]; 
            let store = GD[pos]; //stores the game data with the current position
            GD[pos] = User //sets the new game data to "Current" player being tested (starts with computer)

            let rMove = {}; //Stores the recent move
            rMove.pos = pos //Sets the recent moves position to the current position

            if (User == player.computer) { //If the user is a computer, it runs the algorithm for the humans best moves
                rMove.try = minimax(GD, player.human).try;
            } else { //If the last test was for human moves, it instead tries for computer moves
                rMove.try = minimax(GD, player.computer).try;
            }
            GD[pos] = store; //Resets the game data
            avMove.push(rMove); //Stores the value of that move tried
        }

        let bMove; //Stores the best move
        if (User == player.computer) { 
            bTry = -Infinity; //The worse possible move at first, so anything is better
            for (let i = 0; i < avMove.length; i++) { //For every tried move
                if (avMove[i].try > bTry) { //If that move is "better" than the current best, its made the best
                    bTry = avMove[i].try;   //Its also becomes the best try, that all others will be compared to
                    bMove = avMove[i];
                }
            }
        } else {
            bTry = +Infinity; //Same idea, but for the humans moves so the number is the worse possible move the human can make
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

        for (let pos = 0; pos < GD.length; pos++) { //For every space
            if (!GD[pos]) clear.push(pos); //Its checked if it has any data, if not its added to the list
        }return clear
    }

    function getClicked(pos) {
        for(let i = 0; i < board.length; i++){ 
            for(let j = 0; j < board[i].length; j++) { 
                if(board[i][j] == pos) return{clickI : i, clickJ : j} //Returns the clicked position to an object
            }
        }
    }
        //checks for wins
    function isWin(GD, player) {
        for (let i = 0; i < winPos.length; i++) { //for each 2D element in the 3D array (ie [0, 1, 2], [3, 4 ,5], [6, 7, 8])
            let won = true;
            for (let j = 0; j < winPos[i].length; j++) { //for each item in the 3D elements of the array (ie 0, 1, 2)
                let pos = winPos[i][j];
                won = GD[pos] == player && won; //If there are 3 in a row, it sets win to that specific position
            }if (won) return true; //If won = true, then it returns true
        }return false; // otherwise, it returns false
    }

        //checks for ties 
    function isTie(GD) {
        let isFull = true;

        for (let i = 0; i < GD.length; i++) {isFull = GD[i] && isFull;} //Checks if every single position is full
        if (isFull) return true;
        return false;
    }

    function showGO(player) {
        let Src = `Images/${player}tile.png`;
        let message = player == "tie" ? "Tie" : "Win"; //If its not a tie, its a win to a player
        GOElement.innerHTML = `
            <h1>${message}</h1>
            <img class="W-img" src=${Src} ></img> 
            <div class="play" onclick="location.reload();">Reset</div> 
        `;//Creates a win screen
    GOElement.classList.remove("hide"); //Unhides the screen
    }

    // Adding image sources
    const Xtile = new Image();
    Xtile.src = "Images/Xtile150.png";
    const Otile = new Image();
    Otile.src = "Images/Otile150.png";


    const placement = document.getElementById("place")//sound
    if (muted == true) placement.volume = 0;
    
    // deciding and drawing images on position
    function drawEdit(player, i, j) {
        const Image = player == "X" ? Xtile : Otile;
        ctx.drawImage(Image, j * SI, i * SI);
        
        placement.play()
    }
}