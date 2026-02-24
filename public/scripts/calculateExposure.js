// Array of standard full-stop f-numbers
const STANDARD_F_STOPS = [
    1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64, 90, 128, 133
];

const STANDARD_SHUTTER_SPEEDS = [
    [720, "12 minutes"], [480, "8 minutes"], [360, "6 minutes"], [240, "4 minutes"], [180, "3 minutes" ], [120, "2 minutes"], [90, "1.5 minutes"], [60, "1 minute"], [45, "45 seconds"], [30, "30 seconds"], [16, "16 seconds"], [8, "8 seconds"], [4, "4 seconds"], [2, "2 seconds"], [1, "1 second"], [0.5, "1/2 second"], [0.25, "1/4 second"], [0.01667, "1/60 second"], [0.008, "1/125 second"], [0.002, "1/500 second"], [0.001, "1/1000 second"] ];

const FILM_TYPES = [
    "Ilford HP Plus 400", "Harman Phoenix II 200 Color Negative"
];

// Function to generate and populate the select element
function populateFStopSelect() {
    const select = document.getElementById('originalFStop');
    if (!select) return; // Exit if element not found

    STANDARD_F_STOPS.forEach(fStop => {
        if(fStop <= 64){
            const option = document.createElement('option');
            option.value = fStop;
            option.textContent = `${fStop}`;
            
            // Set f/8 as the default selected option
            if (fStop === 8) {
                option.selected = true;
            }
            select.appendChild(option);
        }
    });
}

// Function to generate and populate the select element
function populateShutterSelect() {
    const select = document.getElementById('originalShutterSpeed');
    if (!select) return; // Exit if element not found

    STANDARD_SHUTTER_SPEEDS.forEach(shutterSpeed => {
        if(shutterSpeed[0] <= 1){
            const option = document.createElement('option');
            option.value = shutterSpeed[0];
            option.textContent = `${shutterSpeed[1]}`;
            
            // Set f/8 as the default selected option
            if (shutterSpeed === "1/60") {
                option.selected = true;
            }
            select.appendChild(option);
        }
    });
}

// Function to generate and populate the select element
function populateFilmSelect() {
    const select = document.getElementById('filmType');
    if (!select) return; // Exit if element not found

    FILM_TYPES.forEach(filmType => {
        if(filmType != ""){
            const option = document.createElement('option');
            option.value = filmType;
            option.textContent = filmType;
            select.appendChild(option);
        }
    });
}

function secondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    // console.log(`reciprocity failure time: ${minutes} and ${remainingSeconds}`)
    const totalTime = `${minutes} minutes and ${remainingSeconds}`;
    return totalTime;
}

function calculateReciprocity(exposureTime, filmStock) { 
    console.log(`Film selected is: ${filmStock}`);
    let reciprocityTime = "";
    if(exposureTime > 0.5){
        switch(filmStock){
            case "Ilford HP Plus 400" :
                reciprocityTime = Math.pow(exposureTime, 1.31);
                break;
            case "Harman Phoenix II 200 Color Negative" :
                reciprocityTime = Math.pow(exposureTime, 1.31);
                break;
            default :
                reciprocityTime = "No film stock matches";
                break;
        }
    }
    else{
        reciprocityTime = "No adjustments are needed for reciprocity failure"
    }
    return reciprocityTime;
}

const resultElement = document.getElementById('result');

// Function to calculate the new shutter speed based on the inverse square law
function calculatePinholeShutterSpeed() {
    
    const originalFStop = document.getElementById('originalFStop').value;
    const originalShutterSpeed = document.getElementById('originalShutterSpeed').value;
    const filmStock = document.getElementById('filmType').value;
    const fStopNum = Number(originalFStop);
    const sSpeedNum = Number(originalShutterSpeed);
    const pinholeFStop = Number(133);
    console.log(`originalShutterSpeed passed to function is ${originalShutterSpeed}`);
    
    const holgaIndex = STANDARD_F_STOPS.indexOf(pinholeFStop)
    const fStopIndex = STANDARD_F_STOPS.indexOf(fStopNum);
    const sSpeedIndex = STANDARD_SHUTTER_SPEEDS.findIndex(s => s[0] === sSpeedNum);
    const fStopDifference = holgaIndex - fStopIndex;
    let increaseSpeed = sSpeedIndex - fStopDifference;

    console.log(`The position of the shutter speed passed to the function is: ${sSpeedIndex}`)
    console.log(`The position of the f-stop passed to the function is: ${fStopIndex}`)
    console.log(`The exposure difference is ${fStopDifference} stops.`)

    // --- BOUNDARY CHECKS ---
    if (increaseSpeed < 0) {
        console.warn("Calculated speed is longer than 3 minutes. Defaulting to max.");
        increaseSpeed = 0; // The first item in your array (180, "3 minutes")
    } else if (increaseSpeed >= STANDARD_SHUTTER_SPEEDS.length) {
        console.warn("Calculated speed is faster than 1/1000. Defaulting to min.");
        increaseSpeed = STANDARD_SHUTTER_SPEEDS.length - 1;
    }

    // Now this will always be a valid array entry
    const newShutterSpeedEntry = STANDARD_SHUTTER_SPEEDS[increaseSpeed];
    const finalLabel = newShutterSpeedEntry[1]; 
    const newExposureTime = newShutterSpeedEntry[0];

    // console.log(`New Shutter Speed: ${finalLabel}`);
    console.log(`Film selected is: ${filmStock}`);

    const reciprosityTime = calculateReciprocity(newExposureTime, filmStock)
    const finalTime = secondsToMinutesAndSeconds(reciprosityTime);

    try {        
        resultElement.innerHTML = `<p>Equivalent shutter speed at **f/133**:</p><p class="calculated-speed">${finalLabel}</p><p>${finalTime} adjusted for reciprocity failure.</p>`;
    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
};