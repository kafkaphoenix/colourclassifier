//Train a model based on crowd source color data
// Based on The Coding Train tutorial by Daniel Shiffman
// Full tutorial playlist:
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bmMRCIoTi72aNWHo7epX4L

let data;
let xs, ys;

let model;

let labelP;
let lossP;
let rSlider, gSlider, bSlider;

let labelList = [
    'red-ish',
    'green-ish',
    'blue-ish',
    'orange-ish',
    'yellow-ish',
    'pink-ish',  
    'purple-ish',
    'brown-ish',
    'grey-ish'
]

function preload() {
    data = loadJSON('https://api.myjson.com/bins/on0fa');
    //data = loadJSON('https://jsonformatter.org/json-editor/63a578');
}

function setup() {
    //console.log(data.entries.length);
    labelP = createP('');
    lossP = createP('Loss');
    rSlider = createSlider(0, 255, 255);
    gSlider = createSlider(0, 255, 0);
    bSlider = createSlider(0, 255, 255);

    let colors = [];
    let labels = [];
    for (let record of data.entries) {
        //normalize
        let col = [record.r/255, record.g/255, record.b/255];
        colors.push(col);
        labels.push(labelList.indexOf(record.label));
    }

    //inputs
    xs = tf.tensor2d(colors);
    //target
    let labelsTensor = tf.tensor1d(labels, 'int32');
    ys = tf.oneHot(labelsTensor, 9).cast('float32'); 
    /*one-hot is a group of bits among which the legal
     combinations of values are only those with a single high (1)
     bit and all the others low (0)*/
    //free memory
    labelsTensor.dispose();

    //console.log(xs.shape);
    //console.log(ys.shape);
    //xs.print();
    //ys.print();

    //architecture for the model

    model = tf.sequential();

    //activation function
    const hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputDim: 3
    });

    const output = tf.layers.dense({
        units: 9, //inputDim is inferred from the previous layers
        activation: 'softmax' 
        /*normalized exponential function is a generalization of the logistic
        function that "squashes" a K-dimensional vector of arbitrary real values
        to a K-dimensional vectorof real values, where each entry is in the interval
        (0, 1), and all the entries add up to 1.*/
    });

    model.add(hidden);
    model.add(output);

    //optimization function
    const lr = 0.25; //learning rate
    const optimizer = tf.train.sgd(lr);

    //loss function

    //compile the model
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy', //Used for classification
        metrics: ['accuracy']
    });

    train().then(results => {
        console.log(results.history.loss);
    });
}

async function train() {
    //train the model
    const options = {
        epochs: 100,
        validationSplit: 0.1,
        shuffle: true,
        callbacks: {
            onTrainBegin: () => console.log('training start'),
            onTrainEnd: () => console.log('training complete'),
            onBatchEnd: async () => {
                await tf.nextFrame();
            },
            onEpochEnd: (epoch, logs) => {
                console.log('Epoch: ' + epoch);
                lossP.html('Loss: ' + logs.loss.toFixed(5));
            }
        }
    }

    return await model.fit(xs, ys, options);//train the model with those options
}

function draw() {
    let r = rSlider.value();
    let g = gSlider.value();
    let b = bSlider.value();
    background(r, g, b);
    stroke(255)
    strokeWeight(2);
    line(frameCount % width, 0, frameCount % width, height);
    
    tf.tidy(() => { //cleans tensors
        const xs = tf.tensor2d([
            [r, g, b]
        ]);
        let results = model.predict(xs);
        let index = results.argMax(1).dataSync()[0]; //maximum index
        //console.log(index);

        let label = labelList[index];
        labelP.html(label);
        
    });
    //index.print();
    
}