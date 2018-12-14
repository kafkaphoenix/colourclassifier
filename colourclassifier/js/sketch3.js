let data;
let xs, ys;

let model;

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
    'grey-ish',
];

function preload() {
    data = loadJSON('https://api.myjson.com/bins/on0fa')
}

function setup() {
    //console.log(data.entries.length);
    lossP = createP("Loss");
    rSlider = createSlider(0, 255, 255);
    gSlider = createSlider(0, 255, 255);
    bSlider = createSlider(0, 255, 0);

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
    ys = tf.oneHot(labelsTensor, 9);
    //free memory
    labelsTensor.dispose();

    //console.log(xs.shape);
    //console.log(ys.shape);
    //xs.print();
    //ys.print();

    //architecture for the model

    model = tf.sequential();

    //activation function
    let hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputDim: 3
    });

    let output = tf.layers.dense({
        units: 9, //No necesitas poner inputDim porque lo saca del anterior
        activation: 'softmax',
    });

    model.add(hidden);
    model.add(output);

    //optimization function
    const lr = 0.2; //learning rate
    const optimizer = tf.train.sgd(lr);

    //loss function

    //compile the model
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy'
    });

    train().then(results => {
        console.log(results.history.loss);
    });
}

async function train() {
    //train the model
    const options = {
        epochs: 10,
        validationSplit: 0.1,
        shuffle: true,
        callbacks: {
            // onTrainBegin: async () => console.log('training start'),
            // onTrainEnd: () => console.log('training complete'),
            onBatchEnd: tf.nextFrame(),
            onEpochEnd: async (num, logs) => {
                await tf.nextFrame();
                console.log('Epoch: ' + num);
                lossP.html('Loss: ' + logs.loss);
                console.log('Loss: ' + logs);
            }
        }
    }

    return await model.fit(xs, ys, options);
}

function draw() {
    let r = rSlider.value();
    let g = gSlider.value();
    let b = bSlider.value();
    background(r, g, b);

    const xs = tf.tensor2d([
        [r / 255,g / 255,b / 255]
    ]);//normalize values
    let results = model.predict(xs);
    let index = results.argMax(1);
    index.print();

    let label = labelList[index];
    index.print();
    // stroke(255)
    // strokeWeight(4);
    // line(frameCount % 100, 0, frameCount % 100, height);
}