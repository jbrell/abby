var db = {
  radpatho: radpatho,
  radsci: radsci,
}
var data = []

//essentials
obj = {
  create(element, attributes={}, content="",){
    var el = document.createElement(element)
    Object.keys(attributes).map(attr=>{
      el.setAttribute(attr, attributes[attr])
    })
    el.textContent= content
  return el
  }
}


function setup() {
  console.log(db);

  const topic = document.getElementById("topic");
  if(db){
    const topics  = Object.keys(db);
    topics.map( t => {
      topic.append( obj.create("option", { value: t }, t) )
    })
    data = db[topics[0]]
    topic.addEventListener("change", (e) => {
      const val = e.target.value
      data = db[val]
      FLASH.shuffled = shuffle(JSON.parse(JSON.stringify(data)));
      FLASH.items = data.length;
      READER.list()
    })
  }
}


GUI = {
  active: 'Read',
  toggle(){
    document.getElementById('modes').style.display = (document.getElementById('modes').style.display=='block' ? 'none' : 'block');
  },
  set mode(mod){
    mod = mod.getAttribute('title');
    document.getElementById('header').setAttribute('mode',mod);
    //document.getElementById('mode').textContent = `Mode: ${mod}`;
    this[mod.toLowerCase()]()
    this.active = mod
  },
  read(){
    READER.list()
  },
  flash(){
    FLASH.init()
  },
  mcq(){
    MCQ.init()
  },

  enlarge(img){
    var  modal = document.getElementById('modal');
    modal.innerHTML = '';
    modal.appendChild(obj.create('img', {src:img.src}));
    modal.setAttribute('active', 'true');
  },


  fontUp(){
    if(this.fontSize>=20) return;
    this.fontSize++
    document.getElementById('main').setAttribute('style',`font-size:${this.fontSize}px;`)
  },

  fontDown(){
    if(this.fontSize<=8) return;

    this.fontSize--;
    document.getElementById('main').setAttribute('style',`font-size:${this.fontSize}px;`)


  },
  fontSize:14,


  closeModal(){
    document.getElementById('modal').setAttribute('active', 'false')
  },

}






MCQ = {
  init(){
    var container = obj.create('h1', { id:'mcq', class:'flashcard', style:'padding-top: 40vh; text-align:center;' }, 'Under Development')
    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(container)
  }
}



//modes

READER = {
  setToolbar(mode, button){
    //document.getElementById('view-mode').innerHTML = mode;
    Array.from(document.getElementsByClassName('reader-view')).forEach((item, i) => {
      if(i==button){
        item.setAttribute('active', 'true')
      }
      else {
        item.removeAttribute('active')
      }
    });
  },
  pdf(){
    this.setToolbar('PDF View', 2)

    var container = obj.create('div', { id:'reader', class:'pdf' })

    data.map( v =>{
        var item = obj.create('div', {id:v.index}, v.index)
        item.appendChild(obj.create('h3', {index:v.index}, v.answer))
        //item.appendChild(obj.create('img',{src:v.image, index: v.index, onclick:"GUI.enlarge(this)",title:'Click to Enlarge'}))
        v.question.map(q=>{
          item.appendChild(obj.create('p', {index:v.index}, q))
        })

        container.appendChild(item)
    });
    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(container)
  },
  grid(){
    this.setToolbar('Grid View', 1)

    var container = obj.create('div', { id:'reader', class:'grid' })

    data.map( v =>{
        var item = obj.create('div', {id:v.index})
        item.appendChild(obj.create('img',{src:v.image, index: v.index, onclick:"GUI.enlarge(this)", title:v.answer}))
        item.appendChild(obj.create('b',{},v.answer))
        item.appendChild(obj.create('p',{},v.question))

        container.appendChild(item)
    });
    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(container)
  },
  list(){
    this.setToolbar('List View', 0)
    var container = obj.create('ol', { id:'reader', class:'list' })
    data.map(v=>{
      var item = obj.create('li', {id:v.index})
      //item.appendChild(obj.create('div', {index:v.index}, v.index))

      item.appendChild(obj.create('span', {}, v.index))

      var div = obj.create('div', {class:'img'})
      div.appendChild(obj.create('img', {src:v.image, onclick:"GUI.enlarge(this)",title:'Click to Enlarge'}))
      item.appendChild(div)

      var div = obj.create('div', {})
      div.appendChild(obj.create('b', {}, v.answer))
      div.appendChild(obj.create('p', {}, v.question))
      item.appendChild(div)

      container.appendChild(item)

    })

    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(container)

  },
}

FLASH = {
  init(){
    var container = obj.create('div', { id:'container', class:'flashcard' })
    // HEADER
    var temp = obj.create('div', {class:"header"})
    temp.appendChild(obj.create('h1', {}, 'Flash Cards'))
    container.appendChild(temp)
    // CARD
    var flash = obj.create('div', {id:'flash', class:'flash', onclick:"FLASH.reveal(this)"})
    var card = obj.create('div', {id:'card', class:'card'})
    var front = obj.create('div', {id:'flashcard-front', class:'front'}, 'front')
    var back = obj.create('div', {id:'flashcard-back', class:'back'}, 'back')
    card.appendChild(front)
    card.appendChild(back)
    flash.appendChild(card)
    container.appendChild(flash)


    // NAV
    var temp = obj.create('div', {class:"nav"})
    temp.appendChild(obj.create('span', {icon:"left-open", onclick:'FLASH.prev()'}))
    temp.appendChild(obj.create('div', {class:"spacer", id:'flash-info'}, 'Shuffle: On'))
    temp.appendChild(obj.create('span', {icon:"right-open", onclick:'FLASH.next()'}))
    container.appendChild(temp)

    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(container)

    this.load(data[0])
  },

  reveal(flash){
    var state = flash.getAttribute('reveal')
    flash.setAttribute('reveal',(state=="true" ? "false": "true") )
  },

  load(data){
    this.still = null;
    flash.setAttribute('still','')
    this.still = setTimeout(function(){
      flash.removeAttribute('still')
    }, 100);


    flash.setAttribute('reveal','false' )

    var front = document.getElementById('flashcard-front')
    var back = document.getElementById('flashcard-back')

    back.innerHTML=""
    front.innerHTML=""

    data.answer.split("\n").map( ans => {
      back.appendChild(obj.create('h1', {}, ans))
    })

    //front.appendChild(obj.create('img', { style:'max-height:300px;', src:data.image}))
    data.question.map( qt => {
      front.appendChild(obj.create('p', { style:'max-width:600px;'}, qt))
    })

    if (this.shuffle) {
      document.getElementById('flash-info').innerHTML = "Shuffle: On";
    } else {
      document.getElementById('flash-info').innerHTML = `${this.index+1}/${this.items+1}`;
    }


  },
  next(){
    this.index = (this.index==this.items-1 ? 0 : this.index+1)
    if (this.shuffle) {
      this.load(this.shuffled[this.index])
    } else {
      this.load(data[this.index])
    }
    return
  },
  prev(){
    this.index = (this.index==0 ? this.items-1 : this.index-1)
    if (this.shuffle) {
      this.load(this.shuffled[this.index])
    } else {
      this.load(data[this.index])
    }
    return
  },


  shuf(){
    var state = document.getElementById('shuffle-state');
    this.shuffle=!this.shuffle
    if(this.shuffle){
      shuffle(this.shuffled)
      state.textContent  = "Shuffle: On"
      this.load(this.shuffled[this.index])

    }
    else{
      state.textContent  = "Shuffle: Off"
      this.load(data[this.index])

    }

  },

  items:0,
  shuffled:[],
  shuffle:false,
  index:0
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}



window.onload = function(){

  //READER.list();
  setup()

  FLASH.shuffled = shuffle(JSON.parse(JSON.stringify(data)));
  FLASH.items = data.length;
  READER.list()


  document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  // Alert the key name and key code on keydown

  if(GUI.active=="Flash"){
  //alert(`Key pressed ${name} \r\n Key code value: ${code}`);

    switch (code) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'KeyS':
      case 'KeyA':
        FLASH.prev();
        break;
      case 'ArrowUp':
      case 'ArrowRight':
      case 'KeyW':
      case 'KeyD':
        FLASH.next();
        break;
      case 'Enter':
      case 'Space':
        FLASH.reveal(document.getElementById('flash'));
        break;
      default:

    }



  }

}, false);

}







var randomMessage = ()=> {
  const months = [
    "I love you Abby",
    "Meow",
    "Study Study Study",
    "Smile",
    "Dance Baby Dance Baby Dance with me!",
    "Baby Hugggggggg",
    "Muwahhhh"
  ];

  const random = Math.floor(Math.random() * months.length);

  return months[random]
}
