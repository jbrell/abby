const fs = require('fs');
const path = require('path')

const dir = path.join("./text.txt")
console.log(dir);
let text = fs.readFileSync("./text.txt")
text = String(text)

const data = text.split("\n\n")

const parsed = data.map( (item, i) => {
    let obj = {
        index:i,
        image:"src/noimg.gif",
        answer:"",
        question:[]
    };
    item.split("\n").map( line => {
        console.log(line);
        if(line.trim().startsWith("–")){
            obj.answer += "\n" + line.replace("–","")
        }
        else {
            obj.question.push(line)
        }
    })
    obj.answer = obj.answer.trim()

    return obj
})

const json = JSON.stringify(parsed)
fs.writeFileSync("./db.json", json)
console.log(json);