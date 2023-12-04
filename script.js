let direction 
let foodX
let foodY 
let isChangingDirection = false
let minInterval = 50
let currentInterval

initialize()
food()
let movement = setInterval(move, currentInterval)

document.addEventListener('keydown',(e)=>{
    if(!isChangingDirection){
        if(e.key=='ArrowRight' && direction!='left'){
            direction = 'right'
        }
        else if(e.key=='ArrowLeft' && direction!='right'){
            direction = 'left'
        }
        else if(e.key=='ArrowUp' && direction!='down'){
            direction = 'up'
        }
        else if(e.key=='ArrowDown' && direction!='up'){
            direction = 'down'
        }
        isChangingDirection = true
    }
})

function initialize(){
    currentInterval = 250
    direction = 'up'
    document.querySelector('#score').innerHTML = 0

    getBoxes().forEach((box)=>{
        box.remove()
    })

    for(let i=0; i<5; i++){
        let style = `margin-left: 0px; margin-top: ${i*40}px;`
        document.querySelector('#snake').insertAdjacentHTML('beforeend',`<div class='box' style='${style}'></div>`)
    }
}

function move(){
    document.querySelector('#snake').insertAdjacentHTML('afterbegin', `<div class='box'></div>`)
    getBoxes()[0].style.marginLeft = `${marginLeft(getBoxes()[1])}px`
    getBoxes()[0].style.marginTop = `${marginTop(getBoxes()[1])}px`
    
    if(direction=='down'){
        getBoxes()[0].style.marginTop = marginTop(getBoxes()[0])==600 ? '0px' : `${marginTop(getBoxes()[0]) + 40}px`
    }
    else if(direction=='up'){
        getBoxes()[0].style.marginTop = marginTop(getBoxes()[0])==0 ? '600px' : `${marginTop(getBoxes()[0]) - 40}px`
    }
    else if(direction=='right'){
        getBoxes()[0].style.marginLeft = marginLeft(getBoxes()[0])==1440 ? '0px' : `${marginLeft(getBoxes()[0]) + 40}px`
    }
    else if(direction=='left'){
        getBoxes()[0].style.marginLeft = marginLeft(getBoxes()[0])==0 ? '1440px' : `${marginLeft(getBoxes()[0]) - 40}px`
    }

    if(marginTop(getBoxes()[0])==foodY && marginLeft(getBoxes()[0])==foodX){
        document.querySelector('#food').remove()
        food()
        document.querySelector('#score').innerHTML = Number(document.querySelector('#score').innerHTML) + 1
        clearInterval(movement)
        currentInterval = currentInterval > minInterval ? currentInterval - 10 : currentInterval
        movement = setInterval(move, currentInterval)
    }
    else{
        getBoxes()[getBoxes().length-1].remove()
    }

    for(let i=1; i<=getBoxes().length-1; i++){
        if(marginTop(getBoxes()[0])==marginTop(getBoxes()[i]) && marginLeft(getBoxes()[0])==marginLeft(getBoxes()[i])){
            alert(`GAME OVER with SCORE: ${document.querySelector('#score').innerHTML}`)
            clearInterval(movement)
            initialize()
            movement = setInterval(move, currentInterval)
        }
    }

    isChangingDirection = false
}

function food(){
    let foodSnakeOverlap

    do{
        foodX = Math.floor(Math.random() * 37) * 40  
        foodY = Math.floor(Math.random() * 16) * 40  

        foodSnakeOverlap = false
        getBoxes().forEach((box)=>{
            if(foodX==marginLeft(box) && foodY==marginTop(box)){
                foodSnakeOverlap = true
            }
        })
    }
    while(foodSnakeOverlap)
    
    let style = `margin-left: ${foodX}px; margin-top: ${foodY}px;`
    document.querySelector('#container').insertAdjacentHTML('beforeend',`<div id='food' style='${style}'></div>`)
}

function marginTop(box){
    return Number(box.style.marginTop.split('px')[0])
}

function marginLeft(box){
    return Number(box.style.marginLeft.split('px')[0])
}

function getBoxes(){
    return document.querySelectorAll('.box')
}