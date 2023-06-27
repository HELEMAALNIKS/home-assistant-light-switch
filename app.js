import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/smarthome.csv"
const trainingLabel = "light"  
const ignored = ["door","window","temperature"]  
let amountCorrect = 0
let totalAmount = 0
let decisionTree

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            // console.log(results.data)
            trainModel(results.data)
                    }
    // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    let json = decisionTree.stringify()
    console.log(json)

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    predictAll(testData)



    // todo : bereken de accuracy met behulp van alle test data
    calculateAccuracy()


}

function calculateAccuracy(){
    //bereken de accuracy met behulp van alle test data
    let accuracy = amountCorrect / totalAmount

    let accuracyHTML = document.getElementById("accuracy")
    accuracyHTML.innerHTML = `Accuracy is ${accuracy}`
}


loadData()


let form = document.forms['model']; 
 
// const element = document.getElementById("button");
// element.addEventListener("click", loadSavedModel);

function loadSavedModel() {
    fetch("./model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

const slider = document.getElementById('light-slider');
      const bedSwitch = document.getElementById('bed-switch');
      const presenceSwitch = document.getElementById('presence-switch');
      const svgElement = document.getElementById('color-toggle');
      let isColored = false;
  
      slider.addEventListener('input', (event) => {
        const value = event.target.value;
        // Do something with the slider value
        // console.log('Slider value:', value);
        loadSavedModel();
      });
  
      bedSwitch.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        // Do something with the bed switch state
        // console.log('Bed switch:', isChecked);
        loadSavedModel();
      });
  
      presenceSwitch.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        // Do something with the presence switch state
        // console.log('Presence switch:', isChecked);
        loadSavedModel();
      });
  

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let lightslider = document.getElementById('light-slider').value;
    let bed = document.getElementById('bed-switch');
    let bedIsChecked = bed.checked;
    let presenceswitch = document.getElementById('presence-switch');
    let presenceswitchIsChecked = presenceswitch.checked;


    // test om te zien of het werkt
    let light = { home: presenceswitchIsChecked, bed: bedIsChecked, lightlevel: lightslider }
    let prediction = decisionTree.predict(light)
    console.log(prediction);

    if (prediction == "true") {
        svgElement.setAttribute('fill', 'yellow');
        svgElement.setAttribute('stroke', 'currentColor');
    }
    
    if (prediction == "false") {
        svgElement.setAttribute('fill', 'none');
        svgElement.setAttribute('stroke', '#000000');

    };

    // console.log("predicted " + predictionText);

    
}



