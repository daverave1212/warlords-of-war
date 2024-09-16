

async function drawCard(canvas, card) {
    
}

async function drawCiv(canvas, civObject) {
    const civName = getOnlyKey(civObject)
    const civ = civObject[civName]
    const civPowers = civ.Powers

    fillCanvasColor(canvas, 'rgb(246, 239, 222)')

    const yOffset = -(canvas.width - canvas.height) / 2
    await drawImageOnCanvasAsync(canvas, `res/civilizations/${civName}.png`, 0, yOffset, canvas.width, canvas.width, 0.15)
    await drawImageOnCanvasAsync(canvas, 'res/Border.png', 0, 0, canvas.width, canvas.height)

    drawText({canvas, font: 'bold 72px GaramondBold', x: canvas.width / 2, y: 120, text: civName.toUpperCase(), textAlign:'center', color: 'black'})

    let currentY = 225
    const drawX = 120
    const titleFontSize = 64
    const textFontSize = 49
    const spaceBetweenPowers = 130 * (civ.spacing != null? civ.spacing : 1)
    const titleFont = 'bold ' + titleFontSize + 'px GaramondBold'
    const keys = Object.keys(civPowers)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const power = civPowers[key]
        const text =
            Array.isArray(power) ? power.join('\n'):
            isString(power) == false ? power['Effect'] :
            power
        drawText({
            canvas,
            font: titleFont,
            x: drawX, y: currentY,
            text: key,
            color: 'black',
            textAlign: 'left',
            isCenteredY: false
        })
        const lines = drawTextLines({
            canvas,
            font: textFontSize + 'px Garamond',
            x: drawX, y: currentY + titleFontSize,
            width: canvas.width * 0.8,
            text,
            lineHeight: textFontSize,
            color: 'black',
            textAlign: 'left',
            isCenteredY: false
        })

        if (power['Resources'] != null) {
            const resources = power['Resources']
            const resourceWidth = 125
            const resourcesStartX = drawX + getTextWidth(titleFont, key) + 50
            const resourceY = currentY - titleFontSize / 2 - resourceWidth / 2
            for (let j = 0; j < resources.length; j++) {
                const resource = resources[j]
                const x = resourcesStartX + j * resourceWidth
                await drawImageOnCanvasAsync(canvas, `res/${resource}.png`, x, resourceY)
            }
        }

        const powerHeight = titleFontSize + textFontSize * lines.length
        
        if (i < keys.length - 1) {
            await drawImageOnCanvasAsync(canvas, 'res/Separator.png', (canvas.width - 1422) / 2, currentY + powerHeight - titleFontSize / 2 + spaceBetweenPowers / 2 - 10)
        }

        currentY += powerHeight + spaceBetweenPowers
    }


}



for (const card of Cards) {
    const canvas = document.createElement('canvas')
    canvas.width = 2480
    canvas.height = 3508
    canvas.style = "width: 90%;"
    document.body.appendChild(canvas)
    drawCard(canvas, card)
}