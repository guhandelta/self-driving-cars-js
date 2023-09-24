// Basic canvas for drawing the road
const canvas = document.getElementById("myCanvas");
canvas.width = 200; //px

// Drawing the car on the canvas
// Need to get the context to be able to draw on the canvas, 2d canvas is used here for this app
const ctx = canvas.getContext("2d");

const road = new Road(canvas.width/2, canvas.width*0.9); // *0.9 to add some margin
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
// car.draw(ctx);

animate();

function animate(){
    // Update the car
    car.update();
    // Resizing the canvas after the car's position is updated, clears the previous position data and leaves no trail
    canvas.height = window.innerHeight;
    // Before drawing the Road: save the context
    ctx.save();
    // Before drawing the Road: Translate nothing on x, bu t
    ctx.translate(0, -car.y+canvas.height*0.8);
    // Draw the road first, so the car can be placed on top of it
    road.draw(ctx);
    // Draw the car with updated position
    car.draw(ctx);

    ctx.restore();
    // requestAnimationFrame calls animate() againa nd again, many times per second, giving the illusion of movement
    requestAnimationFrame(animate);
}