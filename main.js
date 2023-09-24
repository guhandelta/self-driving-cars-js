// Basic canvas for drawing the road
const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200; //px

// Drawing the car on the canvas
// Need to get the context to be able to draw on the canvas, 2d canvas is used here for this app
const ctx = canvas.getContext("2d");

const car = new Car(100, 100, 30, 50);
car.draw(ctx);
