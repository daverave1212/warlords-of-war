

const CARD_WIDTH = 582
const CARD_HEIGHT = 839

const colorToRGB = {
    'Blue': '#45A1FF',
    'Brown': '#A08471',
    'Green': '#5ec862',
    'Purple': '#a45ef4',
    'Red': '#ff3e3e',
    'Teal': '#52e3d7',
    'Yellow': '#fea425',
    'Pink': '#F56FFF',
    'White': '#FFFFE7'
}

async function drawCard(canvas, card, x, y, isWarlord=false) {
    const { Name, Power, Text, Type, Tier, Color } = card

    await drawImageOnCanvasAsync(canvas, `res/Cards/${Name}.png`, x, y, CARD_WIDTH, CARD_WIDTH)
    await drawImageOnCanvasAsync(canvas, 'res/Frame.png', x, y, CARD_WIDTH, CARD_HEIGHT)

    const nameSize = Name.length <= 19? 47 : Name.length > 30? 26 : 37
    const fontColor = Color != null? colorToRGB[Color] : 'white'

    await drawText({
        canvas,
        font: `${nameSize}px DynaPuff`,
        text: Name,
        x: x + 45,
        y: y + 514,
        textAlign: 'left',
        color: fontColor,
        strokeColor: 'black',
        strokeSize: 10
    })

    if (Power != null) {
        const isBig = parseInt(Power) == parseFloat(Power) && parseFloat(Power) >= 0
        const powerSize = isBig? '135px' : '100px'
        const powerX = isBig? 90 : 90
        const powerY = isBig? 130 : 125
        await drawText({
            canvas,
            font: `${powerSize} PatrickHand`,
            text: `${Power}`,
            x: x + powerX,
            y: y + powerY,
            textAlign: 'center',
            color: 'rgb(255, 127, 57)',
            strokeColor: 'rgb(150, 53, 0)',
            strokeSize: 10
        })
    }
    if (isWarlord == true) {
        const badgeX = x + 21
        const badgeY = y + 26
        await drawImageOnCanvasAsync(canvas, `res/Warlord ${Color}.png`, badgeX, badgeY)
    }

    if (Tier != null) {
        const color =
            Tier == 'I'? 'rgb(127, 255, 127, 0.75)':
            Tier == 'II'? 'rgb(127, 127, 255, 0.75)':
            Tier == 'III'? 'rgb(255, 127, 255, 0.75)':
            Color != null ? colorToRGB[Color] :
            'rgb(255, 127, 57, 0.75)'
        const strokeColor =
            Tier == 'I'? 'rgb(0, 127, 53, 0.75)':
            Tier == 'II'? 'rgb(0, 53, 127, 0.75)':
            Tier == 'III'? 'rgb(127, 53, 127, 0.75)':
            'black'
        await drawText({
            canvas,
            font: `50px Texturina`,
            text: `${Tier}`,
            x: x + CARD_WIDTH - 62,
            y: y + CARD_HEIGHT - 41,
            textAlign: 'center',
            color: color,
            strokeColor: strokeColor,
            strokeSize: 10,
            opacity: 0.5
        })
    }

    if (Text != null) {
        const lines = drawTextLines({
            canvas,
            font: '41px PatrickHand',
            x: x + CARD_WIDTH / 2,
            y: y + 690,
            width: CARD_WIDTH * 0.85,
            text: Text,
            lineHeight: 41,
            color: 'black',
            textAlign: 'center',
            isCenteredY: true,
            strokeColor: 'black',
            strokeSize: 1
        })
    }



    let badges = []
    if (Type == 'Spell') {
        badges.push('Spell')
    }
    const possibleBadges = {
        'Reveal:': 'Reveal',
        'Obvious.': "Obvious",
        'Free.': 'Free',
        'Trigger.': 'Trigger',
        'Turn Start:': 'Turn Start',
        'Death:': 'Death',
        'On slide up:': 'Slide'
    }
    for (const possibleBadge of Object.keys(possibleBadges)) {
        if (Text != null && Text.includes(possibleBadge)) {
            badges.push(possibleBadges[possibleBadge])
        }
    }

    const badgeX = x + CARD_WIDTH - 145
    let badgeY = y + 26
    for (const badge of badges) {
        await drawImageOnCanvasAsync(canvas, `res/${badge} Badge.png`, badgeX, badgeY)
        badgeY += 125
    }

    await drawImageOnCanvasAsync(canvas, 'res/Border.png', x, y, CARD_WIDTH, CARD_HEIGHT)
    
    
    function getTribeTextColor(Type) {
        const tribeColor =
            Type == null? 'white':
            Type.includes('Spell')? 'orange' :
            Type.includes('Human')? 'rgb(77, 150, 255)' :
            Type.includes('Undead')? 'rgb(255, 0, 255)' :
            Type.includes('Demon')? 'rgb(256, 77, 44)' :
            Type.includes('Faey')? 'rgb(0, 255, 125)' :
            Type.includes('Dragon')? 'rgb(105, 255, 230)' :
            Type.includes('Angel')? 'rgb(255, 233, 69)' :
            Color != null && colorToRGB[Color] != null? colorToRGB[Color] :
            'white'
        return tribeColor
    }
    if (Type != null) {

        const tribeX = x + CARD_WIDTH / 2
        const tribeY = y + CARD_HEIGHT - 15
        const tribeFont = `48px PatrickHand`


        if (Type.includes('/')) {
            let isDebug = false
            if (Type == 'Demon/Undead') {
                isDebug = true
            }
            let [tribe1, tribe2] = Type.split('/')
            const tribe1Size = getTextWidth(tribeFont, tribe1)
            const slashSize = getTextWidth(tribeFont, '/')
            const tribe2Size = getTextWidth(tribeFont, tribe2)

            if (Type == 'Demon/Undead') {
                console.log({tribe1Size})
            }
            
            const tribe1X = tribeX - slashSize / 2 - tribe1Size
            const tribe2X = tribeX + slashSize / 2

            await drawText({
                canvas,
                font: tribeFont,
                text: tribe1,
                x: tribe1X,
                y: tribeY,
                textAlign: 'left',
                color: getTribeTextColor(tribe1),
                strokeColor: 'rgb(0, 0, 0)',
                strokeSize: 12
            })
            await drawText({
                canvas,
                font: tribeFont,
                text: '/',
                x: tribeX,
                y: tribeY,
                textAlign: 'center',
                color: 'white',
                strokeColor: 'rgb(0, 0, 0)',
                strokeSize: 12
            })
            await drawText({
                canvas,
                font: tribeFont,
                text: tribe2,
                x: tribe2X,
                y: tribeY,
                textAlign: 'left',
                color: getTribeTextColor(tribe2),
                strokeColor: 'rgb(0, 0, 0)',
                strokeSize: 12
            })
        } else {
            await drawText({
                canvas,
                font: tribeFont,
                text: `${Type}`,
                x: tribeX,
                y: tribeY,
                textAlign: 'center',
                color: getTribeTextColor(Type),
                strokeColor: 'rgb(0, 0, 0)',
                strokeSize: 12
            })
        }
    }
}



const xOffset = (2480 - (CARD_WIDTH * 4)) / 2
const yOffset = (3508 - (CARD_HEIGHT * 4)) / 2
let sheetsMade = 0
async function drawCards(cards, isWarlord) {
    while (cards.length > 0) {
        const top16Cards = cards.splice(0, 16)
        const canvas = document.createElement('canvas')
        canvas.width = 2480
        canvas.height = 3508
        document.body.appendChild(canvas)
        sheetsMade++
        let i = 0
        for (const card of top16Cards) {
            let x = xOffset + (i % 4) * CARD_WIDTH
            let y = yOffset + Math.floor(i / 4) * CARD_HEIGHT
            await drawCard(canvas, card, x, y, isWarlord)
            i++
        }
    }
}
async function drawCardsForTTS(cards, isWarlord) {
    if (cards.length > 69) {
        throw('I dont think 70 or more works with TTS.')
    }

    const canvas = document.createElement('canvas')
    canvas.width = 10 * CARD_WIDTH
    canvas.height = 7 * CARD_HEIGHT
    document.body.appendChild(canvas)
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        const x = (i % 10) * CARD_WIDTH
        const y = Math.floor(i / 10) * CARD_HEIGHT
        await drawCard(canvas, card, x, y, isWarlord)
    }

}

async function createCardsForTTS() {
    await drawCardsForTTS(Cards['Tier 1'])
    await drawCardsForTTS(Cards['Tier 2'])
    await drawCardsForTTS(Cards['Tier 3'])
    await drawCardsForTTS(Warlords)
    await drawCardsForTTS(WarlordCards)
    
}

async function createOnlyWarlords1CanvasEach() {
    for (const card of Warlords) {
        const canvas = document.createElement('canvas')
        canvas.width = CARD_WIDTH
        canvas.height = CARD_HEIGHT
        await drawCard(canvas, card, 0, 0, true)
        document.body.appendChild(canvas)
    }
}

function analytics() {
    function analyze(text, cards) {
        for (const card of cards) {
            if (card.Type == null) {
                console.error(`Card ${card.Name} has no Type`)
            }
        }
        console.log(`${text}: ${cards.length}`)
        console.log(`  Of which: Spells(${
            cards.filter(card => card.Type.includes('Spell')).length
        }) Human(${
            cards.filter(card => card.Type.includes('Human')).length
        }) Faey(${
            cards.filter(card => card.Type.includes('Faey')).length
        }) Undead(${
            cards.filter(card => card.Type.includes('Undead')).length
        }) Demon(${
            cards.filter(card => card.Type.includes('Demon')).length
        })`)
        console.log(`  Reveals: ${cards.filter(card => card.Text?.includes('Reveal:')).length}`)
        console.log(`  Deaths: ${cards.filter(card => card.Text?.includes('Death:')).length}`)
    }
    console.log({Cards})

    const onlyUsable = cards => cards.filter(c => c.removedInVersion == null)

    analyze("Tier 1", onlyUsable(Cards["Tier 1"]))
    analyze("Tier 2", onlyUsable(Cards["Tier 2"]))
    analyze("Tier 3", onlyUsable(Cards["Tier 3"]))
}

// createOnlyWarlords1CanvasEach()

async function createAllCardsForPrint() {
    let normalCards = [...Cards['Tier 1'], ...Cards['Tier 2'], ...Cards['Tier 3']]
    let cardsTwice = []
    for (let i = 0; i < normalCards.length; i++) {
        cardsTwice[i * 2] = normalCards[i]
        cardsTwice[i * 2 + 1] = normalCards[i]
    }
    await drawCards(cardsTwice)
    await drawCards(Warlords, true)
    await drawCards(WarlordCards)
    console.log(`Done. Made ${sheetsMade} sheets.`)
}

function doubleArray(cardNames) {
    let cardsTwice = []
    for (let i = 0; i < cardNames.length; i++) {
        cardsTwice[i * 2] = cardNames[i]
        cardsTwice[i * 2 + 1] = cardNames[i]
    }
    return cardsTwice
}

async function createCardsForPrint(doubleCardNames, singleCardNames) {
    const allCards = [...Cards['Tier 1'], ...Cards['Tier 2'], ...Cards['Tier 3'], ...WarlordCards]
    doubleCardNames = doubleArray(doubleCardNames)
    const allCardNames = [...doubleCardNames, ...singleCardNames]
    const cardsToPrint = allCardNames.map(name => {
        const foundCard = allCards.find(card => card.Name == name)
        if (foundCard == null) {
            console.error(`Card ${name} not found.`)
        }
        return foundCard
    })
    await drawCards(cardsToPrint)
    console.log(`Done. Made ${sheetsMade} sheets.`)
}

function sortCards(cards) {
    const tierToNumber = {
        'I': 1,
        'II': 2,
        'III': 3
    }
    return cards.sort((a, b) => {
        const aComparer = tierToNumber[a.Tier] + a.Type + a.Name
        const bComparer = tierToNumber[b.Tier] + b.Type + b.Name
        return aComparer.localeCompare(bComparer)
    })
}
Array.prototype.sortCards = function() {
    return sortCards(this)
}

createCardsForPrint([], AllCards
    .filter(c => c.changedInVersion == 3)
    .sortCards()
    .map(c => c.Name)
)

analytics()