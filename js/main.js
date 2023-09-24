// Basic canvas for drawing the road
const canvas = document.getElementById("myCanvas");
canvas.width = 200; //px

// Drawing the car on the canvas
// Need to get the context to be able to draw on the canvas, 2d canvas is used here for this app
const ctx = canvas.getContext("2d");

const car = new Car(100, 100, 30, 50);
car.draw(ctx);

animate();

function animate(){
    // Update the car
    car.update();
    // Resizing the canvas after the car's position is updated, clears the previous position data and leaves no trail
    canvas.height = window.innerHeight;
    // Draw the car with updated position
    car.draw(ctx);
    // requestAnimationFrame calls animate() againa nd again, many times per second, giving the illusion of movement
    requestAnimationFrame(animate);
}