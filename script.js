const form = document.querySelector("#textChordForm")
const MIN_FRETS = 5
const STRINGS_NUM = 6
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

form.onsubmit = (e) => {
    e.preventDefault()
    let textChord = e.target[0].value
    if (textChord.match(/^[0-9x\-]*$/)?.[0] !== textChord) return alert("Text chord can contain only numbers or x or -")
    textChord = textChord.includes("-") ? textChord.split("-") : textChord.split("")
    if (textChord.length !== STRINGS_NUM) return alert("Text chord must be in format of 6 strings, eg. 8-10-10-9-8-8 or x78797")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    textChord = textChord.map(val => val === "x" ? null : parseInt(val))
    let smallestFretNum = Math.min(...textChord.filter(val => val != null))
    let smallestFretNumWithoutZero = Math.min(...textChord.filter(val => val != null && val > 0 ))
    let biggestFretNum = Math.max(...textChord.filter(val => val != null && val > 0))
    let smallestFretNumOccurencies = textChord.filter(val => val === smallestFretNumWithoutZero).length
    let fretNumToRender = biggestFretNum - smallestFretNumWithoutZero + 1 < 5 ? MIN_FRETS : biggestFretNum - smallestFretNumWithoutZero + 1

    let startingFret = smallestFretNum <= 2 && isFinite(biggestFretNum) && biggestFretNum <= 5 ? 0 : smallestFretNumWithoutZero
    drawFretboard(fretNumToRender, startingFret)
    
    if (startingFret !== 0) {
        textChord.map((fret, i) => {
            let relativeFret = fret - startingFret + 1
            if (fret === null) drawMutedString(i + 1)
            if (fret !== null && relativeFret > 0) drawItemOnFretboard([i + 1, relativeFret])
        })
        //je víc než 1? a další stringy !== menší hodnotu || 0 || null => bar
    } else {
        //render from 0
        textChord.map((fret, i) => {
            if (fret !== null && fret !== 0) drawItemOnFretboard([i + 1, fret])
            if (fret === null) drawMutedString(i+1)
        })
    }
}

let paddingX = 25
let paddingY = 20
let stringsGap = 8
let fretGap = 10;
let fretWidth = 1
let stringWidth = 1;
let pointRadius = 6/2

const drawItemOnFretboard = (relativeCoordinates) => {
    let x = paddingX + (relativeCoordinates[0] - 1) * stringsGap + relativeCoordinates[0] * stringWidth
    let y = paddingY + (relativeCoordinates[1] - 1) * fretGap + fretGap/2 + relativeCoordinates[1] * stringWidth - 0.5;
    ctx.beginPath();
    ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

const drawMutedString = (string, fretNum=5) => {
    ctx.font = "10px Arial";
    ctx.fillText("x", paddingX + string * stringWidth + (string - 1) * stringsGap - 3, paddingY - 5);
}

const drawFretboard = (fretNum, base=0) => {
    if (!isFinite(base)) base=0
    ctx.lineWidth = 3;
    ctx.moveTo(paddingX, paddingY);
    ctx.lineTo(paddingX + STRINGS_NUM * stringWidth + (STRINGS_NUM - 1) * stringsGap, paddingY);
    ctx.stroke();
    ctx.lineWidth = stringWidth;
    for (let index = 0; index <= STRINGS_NUM; index++) {
        ctx.moveTo(paddingX + index * stringWidth + (index === 0 ? 0 : index-1) * stringsGap, paddingY);
        ctx.lineTo(paddingX + index * stringWidth + (index === 0 ? 0 : index - 1) * stringsGap, paddingY + fretNum * fretWidth + fretNum * fretGap);
    }
    ctx.lineWidth = fretWidth;
    for (let index = 1; index <= fretNum; index++) {
        ctx.moveTo(paddingX, paddingY + index * fretWidth + index * fretGap);
        ctx.lineTo(paddingX + STRINGS_NUM * stringWidth + (STRINGS_NUM - 1) * stringsGap, paddingY + index * fretWidth + index * fretGap);
    }
    ctx.stroke();
    if (base !== 0) {
        ctx.font = "10px Arial";
        ctx.fillText(base + "fr", paddingX + STRINGS_NUM * stringWidth + (STRINGS_NUM - 1) * stringsGap + 6, 9+paddingY);
    }
}