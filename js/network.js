class NeuralNetwork{
    // neuronCounts => Number of Neurons in each level
    constructor(neuronCounts){
        // Consi]truct the Nueral Network out of an array of layers/levels [ref: levels.png]
        this.levels=[];
        for(let i=0; i<neuronCounts.length-1;i++){
            // Specify the Input and Output neuron count for each level, while as they are created
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs, network){
        // Outputs will be obtained by providing the givenInputs & network's 1st level'
        let outputs = Level.feedForward(
            // This fn is calling the 1st level to produce it's outputs
            givenInputs, network.levels[0]
        );
        // Looping through the remaining levels and update the outputs with teh feedForward result from the network.levels[i]
        for(let i=1;i<network.levels.length;i++){ // i=1, as the 1st level was created/visited in [ln:16] 
            outputs = Level.feedForward(
                // Provinding the output of the previous level into the new level as the input, adn final output would say if the car should go forward or backward or left or right
                outputs, network.levels[i]
            );
        }
        return outputs;
    }
}

// 1 level
class Level{
    // Each level has many Neurons(Input, Output), their numbers don't necessarily have to match
    constructor(inputCount, outputCount){
        // Values received from teh car's sensors
        this.inputs = new Array(inputCount);
        // Compute outputs using weights & biases defined here(which are random for now, but in a smart brain they'd have a structure)
        this.outputs = new Array(outputCount);
        // Each output neuron has a bias, a value above which it would fire
        this.biases = new Array(outputCount);

        /* In this app, every input neuron would be connected to every other output neuron, which does not apply to the case of human brain. Each input neuron would have outputCount number of connections and connection would have weights.
        Till this step, everything is just a shell, and for the network(brain) to function, these weights and biases should have real values
        */
        this.weights = [];
        for(let i=0;i<inputCount;i++){
            // Prepare an empty output array of the size of the outputCount
            this.weights[i] = new Array(outputCount);
        }


        // random brain
        Level.#randomize(this);
    }

    // fn() to Randomize values and weights
    static #randomize(level){
        // Iterate through every output neuron for every input neuron
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                // set weights for each input:ouput pair
                level.weights[i][j] = Math.random()*2-1; // Math.random()*2 => value b/w 0-2 \ Math.random()*2-1 => value b/w -1 -> 1

            }
        }
        /* -ve weights => car has sensors on the left, front and the right. When the fron sensor senses an obstacle or a car, the car
        should make a turn, left or right. [ref -ve weights.png] when the car is on the rightmost lane, it can only take a left turn, 
        so a -ve weight would be added to the path on the right. Then the -ve weights, connected to teh sensor on the right would send 
        a message "Don't turn to the right", so the remaining option is to turn left.

        Biases would also be on the same range */
        for(let i=0;i<level.biases.length;i++){
            level.biases[i] = Math.random()*2-1;
        }
    }

    /* The outputs are calculated using feedForward Algorithm 
        Given some inputs and levels, 
    */
    static feedForward(givenInputs, level){
        // Iterate through all the level inputs and set them to the given inputs
        for(let i=0;i<level.inputs.length;i++){
            // Values coming from the sensors
            level.inputs[i] = givenInputs[i];
        }
        // Loop through every outputs and calculate the sum between value of the inputs and the weights: [ref output calc.png]
        for(let i=0;i<level.outputs.length;i++){
            let sum=0;
            for(let j=0;j<level.inputs.length;j++){
                // Sum of product of input value and weights of all the path to the current output value fro the current input value
                sum =+ level.inputs[j]*level.weights[j][i];
            }

            // set the output neuron to 1, if the sum is greater than the bias of the output neuron
            if(sum>level.biases[i]){ // can also be implemented as if(sum+level.biases[i]>0) as biases can go eitherway. Any structure implemented as this can also be implemented as if(sum+level.biases[i]>0) [ref: hyperplane_eq.png]
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
            /*In a very very simple network, ws+b=0[weight*sensor_input + bias = 0] is just the line equation, where the weight controls the slope and the bias controls the y-intercept. There is a function available like this for each output. The neurons will fire when the value of the function is greater than 0. With weights and biases between -1<->1, any situation can be implemented.
            Adding more sensors would add additional dimensions, which would be harder to visualize. [ref: dimension1.png, dimensions2.png]
            */
        }
        return level.outputs;
    }
}
