const inputSlider = document.querySelector("[data-length-slider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copybtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copymsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#Number")
const symbolsCheck = document.querySelector("#Symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".Generate-button")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols="~`!@#$%^&*()-+_=\|][{}':;/?>.<,/*"
// defaults
let password= "";
let passwordLength=10;
let checkCount=0;
handleSlider()
setIndicator('#ccc')
 

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    
}


function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min
}


function genRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
   const randNum = getRndInteger(0,symbols.length);
   return symbols.charAt(randNum);
}

 function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum|| hasSym) && passwordLength>=8){
        setIndicator('#0f0');

    }
    else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6
    ){
        setIndicator('#ff0');
    }
    else{
        setIndicator('red');
    }

 }


 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied"
    } 
    catch(e){
        copyMsg.innerText="failed"
    }
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
    
 }

function handleCheckBoxChange(){
     checkCount=0;
     allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
          checkCount++;
        }
     });
     console.log("hello");

    //  special case
    if(passwordLength<checkCount){
        passwordLength=checkCount
        handleSlider();
    }
}

 allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
 })


 inputSlider.addEventListener('input',()=>{
    passwordLength=inputSlider.value;
    handleSlider();
 })

 copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
 })



generateBtn.addEventListener('click',()=>{
   //none of the checkbox are selected
   if(checkCount==0){
   return;
   }
   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }

   //for new password,remove old password
   password="";
   //add stuff told by checkboxes
   
//    if(uppercaseCheck.checked){
//     password+=generateUpperCase();
//    }

//    if(lowercaseCheck.checked){
//     password+=generateLowerCase();
//    }

//    if(numbersCheck.checked){
//     password+=genRandomNumber();
//    }

//    if(symbolsCheck.checked){
//     password+=generateSymbol();
//    }

   let funArr=[]

   if(uppercaseCheck.checked){
    funArr.push(generateUpperCase);
    }

   if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    
   if(numbersCheck.checked){
       funArr.push(genRandomNumber);
    }
    
   if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    console.log("functions pushed in array");


   for(let i=0;i<funArr.length;i++){
    password+=funArr[i]();
   }


   for(let i=0;i<passwordLength-funArr.length;i++){
     let randIndex=getRndInteger(0,funArr.length);
     password+= funArr[randIndex]()
   }

   console.log("password generated");

   password = shufflePassword(Array.from(password));

   passwordDisplay.value=password;
   console.log("password displayed");

   calcStrength();

})

function shufflePassword(array){
//   fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}