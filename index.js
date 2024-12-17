import { upgrades, powerUpIntervals} from "./constants/uprades.js"

let gem = document.querySelector(".gem-cost")
let parsedGem = parseFloat(gem.innerHTML)

let gpcText = document.getElementById("gpc-text")
let gpsText = document.getElementById("gps-text")

let gemImgContainer = document.querySelector(".gem-img-container")

let gpc = 1;

let gps = 0;

const bgm = new Audio('./assets/audio/bgm.mp3')
    const clickingSound = new Audio('./assets/audio/click.mp3')
        const upgradeSound = new Audio('./assets/audio/upgrade.mp3')




bgm.volume = 0.1

function sound () {
    bgm.muted=!bgm.muted
    clickingSound.muted=!clickingSound.muted
    upgradeSound.muted=!upgradeSound.muted
    const img=document.querySelector (".sound img")
    if (bgm.muted){
        img.src="./assets/audio/Speaker_mute.png"
    }else{
        img.src="./assets/audio/Speaker_icon.svg.png"
    }
}

function incrementGem(event) {
    clickingSound.play()

    gem.innerHTML = Math.round(parsedGem += gpc)

    const x = event.offsetX
    const y = event.offsetY

    const div = document.createElement("div")
    div.innerHTML = `+${Math.round(gpc)}`
    div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`
    gemImgContainer.appendChild(div)

    div.classList.add("fade-up")
    timeout(div)
}

const timeout = (div) => {
    setTimeout(() => (
        div.remove()
    ), 800)
}

function buyUpgrade(upgrade) {
    const mu = upgrades.find((u) => {
        if (u.name === upgrade) return u
    })

    const upgradeDiv = document.getElementById(`${mu.name}-upgrade`)
    const nextLevelDiv = document.getElementById(`${mu.name}-next-level`)
    const nextLevelP = document.getElementById(`${mu.name}-next-p`)

    if (parsedGem >= mu.parsedCost) {       
        upgradeSound.volume = 0.1
        upgradeSound.play()

        gem.innerHTML = Math.round(parsedGem -= mu.parsedCost);

        let index = getIndex(mu)
        
        if ( index !== -1 ){
            upgradeDiv.style.cssText = `border-color: white`;
            nextLevelDiv.style.cssText = `background-color: #5a5959; font-weight: normal`;
            mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier)

            if( mu.name === 'clicker'){
                
                gpc *= mu.powerUps[index].multiplier
                nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per click`
            }else{
                gps -= mu.power *= mu.powerUps[index].multiplier
                gps += mu.power
                nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per second`
            }
        }

        mu.level.innerHTML ++
        
        index = getIndex(mu)

        if ( index !== -1 ) {
                console.log(mu.powerUps[index], index);
            upgradeDiv.style.cssText = `border-color: orange`;
            nextLevelDiv.style.cssText = `background-color: #CC4500; font-weight: bold`;
            nextLevelP.innerText = mu.powerUps[index].description

            mu.cost.innerHTML = Math.round(mu.parsedCost * 2.5 * 1.004 ** parseFloat(mu.level.innerHTML))
        } else{
            mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier)
            mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gemMultiplier).toFixed(2))

            if( mu.name === `clicker`)nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per click`
            else{
             nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per second`
            }
        }

        if (mu.name === `clicker`) gpc += mu.parsedIncrease
        else {
            gps -= mu.power
            mu.power += mu.parsedIncrease
            gps += mu.power
        }
    }
}

function getIndex(mu){
let index
    let level=parseFloat(mu.level.innerHTML)
    if (level<100){

        index = powerUpIntervals.indexOf(level)%2

    }else if(level % 50 === 0){
        index = level / 50% 2
    }
    else
    {
        index = -1
    }
    return index
}
function save () {
    localStorage.clear()

    upgrades.map((upgrade) => {

        const obj = JSON.stringify({
            parsedLevel: parseFloat(upgrade.level.innerHTML),
            parsedCost: upgrade.parsedCost,
            parsedIncrease: upgrade.parsedIncrease
        })

        localStorage.setItem(upgrade.name, obj)


    })

    localStorage.setItem('gpc', JSON.stringify(gpc))
    localStorage.setItem('gps', JSON.stringify(gps))
    localStorage.setItem('gem', JSON.stringify(parsedGem))
}

function load () {
    upgrades.map((upgrade) => {
        const savedValues = JSON.parse(localStorage.getItem(upgrade.name))

        upgrade.parsedCost = savedValues.parsedCost
        upgrade.parsedIncrease = savedValues.parsedIncrease

        upgrade.level.innerHTML = savedValues.parsedLevel
        upgrade.cost.innerHTML = Math.round(upgrade.parsedCost)
        upgrade.increase.innerHTML = upgrade.parsedIncrease
    })

    gpc = JSON.parse(localStorage.getItem('gpc'))
    gps = JSON.parse(localStorage.getItem('gps'))
    parsedGem = JSON.parse(localStorage.getItem('gem'))

    gem.innerHTML = Math.round(parsedGem)
}


setInterval(() => {
    parsedGem += gps / 10
    gem.innerHTML = Math.round(parsedGem)
    gpcText.innerHTML = Math.round(gpc)
    gpsText.innerHTML = Math.round(gps);
    bgm.play()
}, 100)

window.incrementGem = incrementGem
window.buyUpgrade = buyUpgrade
window.save = save
window.load = load
window.sound = sound