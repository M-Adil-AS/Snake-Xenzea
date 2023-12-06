let direction 
let prev_direction
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
        if(e.key=='ArrowRight' && direction!='left' && direction!='right'){
            prev_direction = direction
            direction = 'right'
            isChangingDirection = true
        }
        else if(e.key=='ArrowLeft' && direction!='right' && direction!='left'){
            prev_direction = direction
            direction = 'left'
            isChangingDirection = true
        }
        else if(e.key=='ArrowUp' && direction!='down' && direction!='up'){
            prev_direction = direction
            direction = 'up'
            isChangingDirection = true
        }
        else if(e.key=='ArrowDown' && direction!='up' && direction!='down'){
            prev_direction = direction
            direction = 'down'
            isChangingDirection = true
        }       
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
        let src = i==0 ? `head ${direction}.png` : i==4 ? `tail ${direction}.png` : "vertical.png"

        document.querySelector('#snake').insertAdjacentHTML('beforeend',`<img src='${src}' class='snakeBox' style='${style}'>`)
    }
}

function move(){
    const tailX = marginLeft(getBoxes().slice(-1)[0])
    const tailY = marginTop(getBoxes().slice(-1)[0])
    const tailImage = getBoxes().slice(-1)[0].getAttribute('src')
    const tailPredcessorImage = getBoxes()[getBoxes().length - 2].getAttribute('src')

    for(let i = getBoxes().length - 1; i > 0; i--){
        getBoxes()[i].style.marginLeft = `${marginLeft(getBoxes()[i-1])}px`
        getBoxes()[i].style.marginTop = `${marginTop(getBoxes()[i-1])}px`
        getBoxes()[i].src = getBoxes()[i-1].getAttribute('src')
    }
    
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

    getBoxes()[0].src = `head ${direction}.png`
    
    if(isChangingDirection){
        let turnImage = getTurnImage()
        getBoxes()[1].src = turnImage
    }
    else{
        getBoxes()[1].src = (direction=='up' || direction=='down') ? `vertical.png` : `horizontal.png`
    }

    if(marginTop(getBoxes()[0])==foodY && marginLeft(getBoxes()[0])==foodX){
        let style = `margin-left: ${tailX}px; margin-top: ${tailY}px;`
        document.querySelector('#snake').insertAdjacentHTML('beforeend', `<img class='snakeBox' src='${tailImage}' style='${style}'>`)
        document.querySelector('#food').remove()
        food()
        document.querySelector('#score').innerHTML = Number(document.querySelector('#score').innerHTML) + 1
        clearInterval(movement)
        currentInterval = currentInterval > minInterval ? currentInterval - 10 : currentInterval
        movement = setInterval(move, currentInterval)
    }
    else{
        if(tailPredcessorImage.includes('vertical') || tailPredcessorImage.includes('horizontal')){
            getBoxes().slice(-1)[0].src = tailImage
        }
        else{
            let tail_prevDirection = tailImage.split(' ')[1][0]
            let tailPredcessorTurnFromIndex = tailPredcessorImage.indexOf(tail_prevDirection)
            let tailPredcessorTurnTo = tailPredcessorImage[tailPredcessorTurnFromIndex + 2]
            getBoxes().slice(-1)[0].src = `tail ${getFullForm(tailPredcessorTurnTo)}.png`
        }
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

function getTurnImage(){
    let turnImages = ['ltu dtr.png', 'rtu dtl.png', 'utl rtd.png', 'utr ltd.png']
    let currentTurn = `${prev_direction[0]}t${direction[0]}`
    let currentTurnImage = turnImages.find(img => img.includes(currentTurn))
    return currentTurnImage
}

function marginTop(box){
    return Number(box.style.marginTop.split('px')[0])
}

function marginLeft(box){
    return Number(box.style.marginLeft.split('px')[0])
}

function getFullForm(alphabet){
    let alphabets = ['u', 'r', 'd', 'l']
    let directions = ['up', 'right', 'down', 'left']
    return directions[alphabets.indexOf(alphabet)]
}

function getBoxes(){
    return Array.from(document.querySelectorAll('.snakeBox'))
}