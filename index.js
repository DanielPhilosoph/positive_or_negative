// =====================================
//=========== Consts ===================
//======================================

const SENTIM_API_LINK = "https://sentim-api.herokuapp.com/api/v1/";
const FLOAT_TO_PRECENT = 100;

//======================================
// ============ Main Run ===============
//======================================
document.addEventListener("click", onClickHandel);
let resultP = document.querySelector("#resultP");
let loaderElement = document.querySelector("#loader");
let catStatus = document.querySelector("#http-status");
let progressbar = document.querySelector("#progressbar");
let root = document.querySelector(':root');



//========================================
//=============== functions ==============
//========================================

async function analyzeText(text) {   
    let response;        
    let timeToLoadSec;
    const resultObject = {};     

    //Loading...
    resultP.style.color = textColorByType("loading");
    loaderElement.style.display = 'block';
    progressbar.style.display = "none";
    resultP.innerText = "Loading......"; 
    
    //Gets time
    timeToLoadSec = new Date().getTime()

    // fetch API
    response = await fetch(SENTIM_API_LINK, 
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({'text':text}),
        }
    )

    // Calculate fetch time - seconds
    timeToLoadSec = (new Date().getTime() - timeToLoadSec) / 1000;       

    // Gets response status and show cat
    statusCatPhoto(response.status);

    //Done loading    
    loaderElement.style.display = 'none';
    resultP.innerText = "";

    // Check errors
    if(!response.ok){              
        resultObject["error"] = "Error! Something went wrong => " + response.statusText;        
        return resultObject;         
    }   

    let data = await response.json();            
    
    // Create returned object
    resultObject['type'] = data.result.type;
    resultObject['polarity'] = data.result.polarity;
    resultObject['timeToLoadSec'] = timeToLoadSec;
    resultObject["error"] = "";
    
    return resultObject;
}

// ===> handles a click on screen <===
async function onClickHandel(event){
    let textToAnalyze = document.querySelector("#userText").value;
    let progressbar = document.querySelector("#progressbar");
    if(event.target.id === "clearButton"){
        clear()
    }
    if(event.target.id === "submitButton")
    {                        
        let analyzedObject = await analyzeText(textToAnalyze);
        if(analyzedObject.error === ""){            
            resultP.style.color = textColorByType(analyzedObject.type);
            resultP.innerText = `The text type is: ${analyzedObject.type} \n
            And the polarity is equal to ${analyzedObject.polarity} \n
            Time to fetch: ${analyzedObject.timeToLoadSec} seconds`;
            progressbar.style.display = "block";
            progressbarLength(analyzedObject.polarity)            
        }
        else{
            // Error             
            resultP.style.color = "black";          
            resultP.innerText = analyzedObject.error;
            progressbar.style.display = "none";
        }
        
    }
    
}
