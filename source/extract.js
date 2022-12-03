const fs = require('fs');
const path = require('path')

const target = "radpatho";

const dir = path.join("."+ target +".txt")
console.log(dir);
let text = fs.readFileSync("./"+ target +".txt")
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
        if(line.trim().startsWith("-")){
            obj.answer += "\n" + line.replace("-","")
        }
        else {
            obj.question.push(line)
        }
    })
    obj.answer = obj.answer.trim()

    return obj
})

const json = `${target} = ${JSON.stringify(parsed)}`
fs.writeFileSync("./"+ target +".json", json)
console.log(json);