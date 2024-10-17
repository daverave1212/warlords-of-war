

const CARD_WIDTH = 582
const CARD_HEIGHT = 839

const colorToRGB = {
    'Blue': '#45A1FF',
    'Brown': '#A08471',
    'Green': '#5ec862',
    'Purple': '#a45ef4',
    'Red': '#ff3e3e',
    'Teal': '#52e3d7',
    'Yellow': '#fea425'
}

async function drawCard(canvas, card, x, y, isWarlord=false) {
    const { Name, Power, Text, Type, Tier, Color } = card

    console.log('Drwing ' + Name)
    console.log({card})
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
        const isBig = parseInt(Power) == parseFloat(Power)
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
        console.log(Text)
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
        console.log({possibleBadge})
        if (Text != null && Text.includes(possibleBadge)) {
            badges.push(possibleBadges[possibleBadge])
        }
    }
    console.log('Done')

    const badgeX = x + CARD_WIDTH - 145
    let badgeY = y + 26
    for (const badge of badges) {
        await drawImageOnCanvasAsync(canvas, `res/${badge} Badge.png`, badgeX, badgeY)
        badgeY += 125
    }

    await drawImageOnCanvasAsync(canvas, 'res/Border.png', x, y, CARD_WIDTH, CARD_HEIGHT)
    
    
    if (Type != null) {
        // const tribeWidth = 162
        // const tribeHeight = 42
        const tribeColor =
            Type == 'Spell'? 'orange' :
            Type == 'Human'? 'rgb(77, 150, 255)' :
            Type == 'Undead'? 'rgb(255, 0, 255)' :
            Type == 'Demon'? 'rgb(256, 77, 44)' :
            Type == 'Faey'? 'rgb(0, 255, 125)' :
            Color != null? colorToRGB[Color] :
            'white'
        await drawText({
            canvas,
            font: `48px PatrickHand`,
            text: `${Type}`,
            x: x + CARD_WIDTH / 2,
            y: y + CARD_HEIGHT - 15,
            textAlign: 'center',
            color: tribeColor,
            strokeColor: 'rgb(0, 0, 0)',
            strokeSize: 12
        })
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
}

createCardsForTTS()

async function createCardsForPrint() {
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
