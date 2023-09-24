class Controls{
    constructor(){
        // These are initially set to false, but will change as per the keys pressed
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        
        // Keyboard listener to listen for keyboard events (onKeyDown & onKeyUp)
        this.#addKeyboardListeners();
    }
    
    #addKeyboardListeners(){
        // Arrow fn() is used here so the event listeners point to the var defn in the constructor, instead of keeping the reference within the document.onkeydown() or document.onkeyup()
        document.onkeydown = (e) =>{
            switch(e.key){
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.backward = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
            console.table(this);
        }

        document.onkeyup = (e) =>{
            switch(e.key){
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.backward = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
            console.table(this);
        }
    };
}