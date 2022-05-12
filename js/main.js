// Изменение угла поляризатора
$('.polar__angle').knob({
	'min':0,
	'max':360	,
})
// Увеличение/уменьшение интенсивности
$('.change-intencive__input').knob({
	'min':22,
	'max':60,
})


// Скрытие/появление элементов установки 
const input1 = document.querySelector('.input_1'),
brust = document.querySelector('.installation__bruster'), input3 = document.querySelector('.input_3'),
light = document.querySelector('.installation__polarisator_light'),input2 = document.querySelector('.input_2'),
laser = document.querySelector('.installation__polarisator_laser'), input4 = document.querySelector('.input_4')


function addToggleClass(clickElem, toggleElem){
	clickElem.addEventListener('change', () => {
		toggleElem.classList.toggle('installation__active')
	})
}

addToggleClass(input2, brust)
addToggleClass(input3, light)
addToggleClass(input4, laser)

// Скрытие/появление установки для брюстера
const overlay = document.querySelector('.overlay'),
brustBtn = document.querySelector('.status-panel__bruster'),
overlayClose = document.querySelector('.overlay__close')

function overlayHeight(){overlay.style.height =  document.body.scrollHeight  + 'px'}

overlayHeight()
window.addEventListener('resize', ()=> {
	overlayHeight()
})

brustBtn.addEventListener('click', () => {
	overlay.classList.add('display-flex')
})
overlayClose.addEventListener('click', () => {
	overlay.classList.remove('display-flex')
})
overlay.addEventListener('click', (e) => {
	if(e.path.length === 5){
		overlay.classList.remove('display-flex')
	}
})

// Скрытие/появление status bar(а)

const statusPanel = document.querySelector('.status-panel'), 
clickDiv = document.querySelector('.status-panel__toggle')

clickDiv.addEventListener('click', () => {
	statusPanel.classList.toggle('status-panel__open')
	clickDiv.classList.toggle('status-panel__toggle_close')
})




// Задача 1 и 2 : Минимум/максимум интенсивности

const output = document.querySelector('.output'), 
spanOutput = document.querySelector('.span-output'),
polarWrapper = document.querySelector('.polar'),
polarCanvas = document.querySelector('.polar canvas'),
polarisator = document.querySelector('.polar__angle'),
intenciveInput = document.querySelector('.change-intencive__input'),
ratioWrapper = document.querySelector('.change-intencive'),
ratioElem = document.querySelector('.change-intencive__input'),
ratioValueMax = ratioElem.dataset.max,
firstPolarAngle = 0,
intenciveLaser = 1.06,
intenciveLight = 1.998


let intencive = 0, ratio = 1


function getRatio(){
	ratio = ratioElem.value/ratioValueMax
	return ratio
}


function listener(elem, events, func, params){
	for(let i=0; i < events.length; i++){
		elem.addEventListener(events[i], () => {func(params)})
	}
}


function setIntencive(int){
	intencive = getRatio()*(int*((Math.cos(Math.PI*(polarisator.value)/180))**2))
	output.innerText = intencive.toFixed(4)
	spanOutput.innerText = intencive.toFixed(4)
}
setIntencive(intenciveLaser)

function checkValue(params){
	if(!(params[0] === polarisator.value)){
		params[0] = polarisator.value
		setIntencive(params[1])
	}
}

function minMax(intc){
	listener(polarWrapper, ['click', 'wheel','keydown'], checkValue, [polarisator.value, intc])
}



// Задача 3: Угол Брюстера

const brustInput = document.querySelector('.brust__input'),
brustWrapper = document.querySelector('.brust'),
dot = document.querySelector('.overlay__dot'),
brustAngl = 57

function setDotStyles(){
	if(brustInput.value >=27 && brustInput.value<=71){
		let margin = 284 + (brustInput.value - 30)*5.35
		dot.style.marginTop = margin + 'px'
		setOpacity()
	}
}
function setOpacity(){
	if(brustInput.value == brustAngl){
		dot.style.opacity = 0.2
	} else{
		dot.style.opacity = Math.abs(Math.sin(Math.PI*(brustInput.value - brustAngl)/180)) +0.35
	}
}

function third(){
	setDotStyles()
	brustWrapper.addEventListener('click', () => {
		setDotStyles()
	})
	brustInput.addEventListener('change', () => {
		setDotStyles()
	})
}


// вызовы

let btnFirst = 0, btnSec = 0, btnThird = 0, btnFourth = 0, btnInterval = 0

const inputRadioWrapper = document.querySelector('.lambda-wrapper'),
inputRadio = document.querySelectorAll('.lambda-wrapper__input')

function getInterval(){
	inputRadioWrapper.addEventListener('click', (e) => {
		if(e.target == inputRadio[0]){btnInterval = 0}
		else 
		if(e.target == inputRadio[1]){btnInterval = 1}
	})
}

getInterval()

statusPanel.addEventListener('click', (e) => {
	if(e.target.classList.contains('input_1')){
		if(btnFirst === 0){
			setIntencive(intenciveLight)
		} else if( btnFirst === 1){
			setIntencive(intenciveLaser)
		}
	}
})

function BtnPress(el){
	if(el.checked){
		return 1
	} else {
		return 0
	}
}

function pointerEvent(type, item){
	if( type == 'none'){
		item.style.pointerEvents = 'none'
	} else if( type == 'all'){
		item.style.pointerEvents = 'all'
	}
}

function getBrustAngl(){
	let value = 0
	brustWrapper.addEventListener('click', () => {
		value = brustInput.value
	})
	brustInput.addEventListener('change', () => {
		value = brustInput.value
	})
	return value
}

function getButtons(){
	/* 
		1 - инпут в состоянии checked, другими словами элемент активен
		(в случае первого инпута в состоянии 0 - лазер, в состоянии 1 - свет))
	*/
	if(BtnPress(input1)){btnFirst = 1}else{btnFirst = 0}
	if(BtnPress(input3)){btnSec = 1}else{btnSec = 0}
	if(BtnPress(input2)){btnThird = 1}else{btnThird = 0}
	if(BtnPress(input4)){btnFourth = 1}else{btnFourth = 0}
}

function callAllFunc(){
	// 1
	if((btnFirst === 0) && (btnThird === 0) && ((btnSec === 1) ^ (btnFourth === 1))  && (btnInterval === 1)){
		pointerEvent('all', polarWrapper)
		minMax(intenciveLaser)
	}else
	// 2 
	if((btnFirst === 1) && (btnSec === 1) && (btnThird === 0) && (btnFourth === 1) && (btnInterval === 0)){
		pointerEvent('all', polarWrapper)
		minMax(intenciveLight)
	}else
	// 4
	if((btnFirst === 1) && (btnSec === 0) && (btnThird === 1) && (btnFourth === 1) && (btnInterval === 0) && (brustInput.value == brustAngl)){
		pointerEvent('all', polarWrapper)
		minMax(intenciveLight)
	}else{
		pointerEvent('none', polarWrapper)
	} 
	// 3
	if((btnFirst === 0) && (btnSec === 0) && (btnThird === 1)){
		pointerEvent('all', brustWrapper)
		third()
	} else{
		pointerEvent('none', brustWrapper)
	}
}

statusPanel.addEventListener('click', () => {
	getButtons()
	callAllFunc()
})
inputRadioWrapper.addEventListener('click', () => {
	getButtons()
	callAllFunc()
})

// const arrTarg = [[statusPanel, 'click'], [inputRadioWrapper, 'click'], [ratioWrapper, 'click','wheel']]

// for(let i = 0; i < arrTarg.length; i++){
// 	for(let j = 1; j < arrTarg.length; j++){
// 		arrTarg[i][0].addEventListener(arrTarg[i][j], () => {
// 			getButtons()
// 			callAllFunc()
// 		})
// 	}
// }