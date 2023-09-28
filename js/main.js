// Basic canvas for drawing the road
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200; //px
// Canvas to display the Neural Network
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300; //px

// Drawing the car on the canvas
// Need to get the context to be able to draw on the canvas, 2d canvas is used here for this app
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9 ); // *0.9 to add some margin
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
// car.draw(ctx);
// An array of cars
const traffic = [
    // A new car in the same lane as th current one is, but at some distance ahead, and be the 1st obstacle to avoid
    new Car(road.getLaneCenter(1), -100, 30, 50, "BOT", 2),
];

animate();

function animate(time){

    
    for(let i=0;i<traffic.length;i++){
        // updating each car the highlighting the road borders
        // [] is passed for traffic, because the car will interact with itself and collides with itself, if traffic is passed, then it would be necessary for the other cars. This also makes the traffic immune to collision with other objects, as piled up cars on the road might not look good.
        traffic[i].update(road.borders, []);
    }
    // Update the car \\ without passing road.borders() the sensor has no clue of the road borders
    car.update(road.borders, traffic);
    // Resizing the canvas after the car's position is updated, clears the previous position data and leaves no trail
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    // Before drawing the Road: save the context
    carCtx.save();
    // Before drawing the Road: Translate nothing on x, bu t
    carCtx.translate(0, -car.y+carCanvas.height*0.8);
    // Draw the road first, so the car can be placed on top of it
    road.draw(carCtx);
    // Draw the traffic by iterating through the traffic array
    for(let i=0;i<traffic.length;i++){
        // updating each car the highlighting the road borders
        traffic[i].draw(carCtx, "Sienna");
    }
    // Draw the car with updated position
    car.draw(carCtx, "Maroon");

    carCtx.restore();

    networkCtx.lineDashOffset = -time/40;
    // Visualized the Neural Networks for the self driving car
    Visualizer.drawNetwork(networkCtx, car.brain);
    // requestAnimationFrame calls animate() againa nd again, many times per second, giving the illusion of movement
    requestAnimationFrame(animate);
}