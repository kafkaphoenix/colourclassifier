let colorByLabel = {
    'blue-ish': [],
    'green-ish': [],
    'pink-ish': [],
    'grey-ish': [],
    'red-ish': [],
    'purple-ish': [],
    'brown-ish': [],
    'orange-ish': [],
    'yellow-ish': [],
}

let label = 'blue-ish';

let filter = {
    //'OZXDalvAf6O0CoPNfWAfuvChtik2': true,
}

function setup() {

    createCanvas(400, 400);

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyDOseL1zAQ0tOavgHYZfezMdfk7SuVQ3cg",
    authDomain: "colorclassifier-90a84.firebaseapp.com",
    databaseURL: "https://colorclassifier-90a84.firebaseio.com",
    projectId: "colorclassifier-90a84",
    storageBucket: "colorclassifier-90a84.appspot.com",
    messagingSenderId: "662546774537"
    };
    firebase.initializeApp(config);
    database = firebase.database();

    let ref = database.ref('colors');
    ref.once('value', gotData);
}

function mousePressed()
{
    //get data about a specific color cell
    let i = floor(mouseX / 10);
    let j = floor(mouseY / 10);
    let index = i +j * (width / 10) 
    let data = colorByLabel[label];
    console.log(data[index]);
}

function gotData(results)
{   
    let data = results.val();
    let allData = {
        entries: [],
    };

    let keys = Object.keys(data);
    console.log(keys.length);

    let userData = [];

    let uid_bycount = {};
    let users = [];

    for(let key of keys) {
        let record = data[key];
        colorByLabel[record.label].push(record);
        let idi = record.uid;
/* uncomment to get all colors selected by x user
        if(record.uid == '83M6bZmgQjc1zdY0HAAeninzews2') {
            userData.push(record);
        }
  */  
 //Sum all entries of a user    
        if (!uid_bycount[idi]) {
            uid_bycount[idi] = 1;
            users.push(idi);
        } else {
            uid_bycount[idi]++;
        }

        //filter
        let id = record.uid;
        if (!filter[id]) {
            allData.entries.push(record);
        }
    }

    users.sort((a,b) => { 
        return (uid_bycount[a] - uid_bycount[b]);
    })
    //total entries by user
    for(let ide of users)
    {
        console.log(`${ide} ${uid_bycount[ide]}`);
    }

    // draw all colors grouped by label
    let blues = colorByLabel[label];
    let x = 0;
    let y = 0;
    for(let i = 0; i < blues.length; i++)
    {
        noStroke();//no borders
        fill(blues[i].r, blues[i].g, blues[i].b);
        rect(x,y,10,10);
        x+=10;
        if(x >= width)//next line
        {
            x = 0;
            y += 10;
        }
    }

    console.log(colorByLabel);
/* uncomment to show all colors selected by x user
    userData.sort((a,b) => {
        if (a.label > b.label) { 
            return 1;
        } else {
            return -1;
        }
    });

    for (let entry of userData) {
        let div = createDiv(entry.label + " ");
        let colorBox = createDiv('');
        colorBox.parent(div);
        colorBox.style('display','inline-block');
        colorBox.size(10,10);
        colorBox.style('background-color',`rgb(${entry.r},${entry.g},${entry.b})`)
    }
    */
    //saveJSON(allData, 'colorData.json');
}