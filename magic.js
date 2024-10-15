let colours = ['#59fffa','#5996ff','#be59ff','#ff59e2','#ff597c','#ff6959'].reverse()
///////////
//OSWALD //
///////////

function generateColumnRows(rows=20,columns=20){
let t=0
  return new Array(rows).fill([]).map((x,iParent)=>{
      return new Array(columns).fill([]).map((e,i)=>{
          return [false,t+=1]
      })
  })
}
///////////
//OSWALD //
///////////

let DATA_SETS = []
let path = generateColumnRows(27,40)
function createRows(){
  const gridContainer = document.querySelector('.grid-container')
  path.map(e=>{
    e.map(e=>{

      const div = document.createElement('div')
      div.setAttribute('gp', e[1])
      if (e[0]) {
        div.classList.add('taken')
      }
      // div.textContent = e[1]
      gridContainer.append(div)

    })
  })
}
createRows()
initialPoint = [2,4]//x,y
configuration = {
  rows:6,
  columns:6,
  by:6,
  fps:20,
  snakeLTail:3
}
let score = 0
let history = []
function randomStartPoint(){
  const x = Math.floor(Math.random()*20)
  const y = Math.floor(Math.random()*20)
  path[y][x][0] = true
  const div = document.querySelector(`div[gp="${path[y][x][1]}"]`)
  div.classList.add('taken')
  return [[x,y],path[y][x],"START"]
}

function setFood(){
  const x = Math.floor(Math.random()*20)
  const y = Math.floor(Math.random()*20)
  path[y][x][2] = true
  
  const div = document.querySelector(`div[gp="${path[y][x][1]}"]`)
  div.classList.add('food')
  return [[x,y],path[y][x],"FOOD"]
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(colours)

function findNearest(__history__=[null,null]) {
  if (typeof __history__[0] != 'number' || typeof __history__[1] != 'number') return [false,null]

  function top(){

      ////////
      //TOP //
      ////////
      y = __history__[1]-1
      x = __history__[0]
      if (path[y] != undefined && path[y][x] != undefined && !path[y][x][0]) {
        path[y][x][0]=true
        history.push([x,y])
        return [[x,y],path[y][x],"TOP"]
      }
      ////////
      //TOP //
      ////////
      
      return null
  }

  function bottom(){
  ///////////
  //BOTTOM //
  ///////////
  y = __history__[1]+1
  x = __history__[0]
  if (path[y] != undefined && path[y][x] != undefined && !path[y][x][0]) {
    path[y][x][0]=true
    history.push([x,y])
    return [[x,y],path[y][x],"BOTTOM"]
  }
  ///////////
  //BOTTOM //
  ///////////
    return null
  }

  function left(){
  /////////
  //LEFT //
  /////////
  y = __history__[1]
  x = __history__[0]-1
  if (path[y] != undefined && path[y][x] != undefined && !path[y][x][0]) {
    path[y][x][0]=true
    history.push([x,y])
    return [[x,y],path[y][x],"LEFT"]
  }
  /////////
  //LEFT //
  /////////
    return null
  }

  function right(){
  /////////
  //RIGHT /
  /////////
  y = __history__[1]
  x = __history__[0]+1
  if (path[y] != undefined && path[y][x] != undefined && !path[y][x][0]) {
    path[y][x][0]=true
    history.push([x,y])
    return [[x,y],path[y][x],"RIGHT"]
  }
  /////////
  //RIGHT /
  /////////
    return null
  }
  const whereToSeeFirst = [top,bottom,left,right]
  shuffleArray(whereToSeeFirst)
  for (let i = 0; i < whereToSeeFirst.length; i++) {
     const x = whereToSeeFirst[i]()
     if (x!=null) {
      return x
     }
  }
  return [[null,null],[],"NONE"]
}
function reset(){
  path.map(e=>e.map(e=>{
    e[0]=false
    const div = document.querySelector(`div[gp="${e[1]}"]`)
    div.classList = ""
    return e
  }))
  history = []
}

function restart(){
  tempData = []
  revTemp = []
  score = 0
  reset()
  start()
}

//////////////
// THE GAME //
//////////////
let tempData = []
let gameInterval;
let revTemp = []
function start(){
  initialPoint = randomStartPoint()
  // setFood()
  tempData.push(initialPoint)
  revTemp.push(initialPoint)
  history.push(initialPoint[0])
  console.log("pushing first history",initialPoint[0]);

  gameInterval = setInterval(()=>{

    // console.log({history,fk_history:history[history.length-1]});

    const d =  findNearest(history[history.length-1])
    // console.log({d});


    if(d[2]!="NONE"){
    score++

    

    // console.log({d});

        const div = document.querySelector(`div[gp="${d[1][1]}"]`)
        div.classList.add('taken')
        tempData.push(d)
        revTemp.push(d)

        if (score>3) {

          // console.log(score)

          const tmp = [...revTemp].reverse()
          const gp = tmp[(tmp.length-1)]
          // console.log({gp})
          if (gp) {

            const div = document.querySelector(`div[gp="${gp[1][1]}"]`)
            div.classList.remove('taken')
            div.classList.add('gone')
            
            div.style.backgroundColor = colours[0]

            setTimeout(()=>{
              div.classList.remove('gone')
               div.style.backgroundColor = ""
            },200)
            tmp.pop()
            revTemp = tmp.reverse()
            const [x,y] = gp[0]
            path[y][x][0] = true //changed
          }
        }


    }else {
      // DATA_SETS.push(tempData)
      clearInterval(gameInterval)
      gameInterval = null
      const [x,y] = history[history.length-1]
      //   const div = document.querySelector(`div[gp="${path[y][x][1]}"]`)
      //   div.classList.add('killed')
        setTimeout(()=>{
          // shuffleArray(colours)
          restart()
        },0)
        // div.textContent = "Killed.."
      // alert(`Your Score is -> ${score}, Game ends. | Theres no path available to move.`)
    }

  }, 1000 / configuration.fps)

}

// start()

//////////////
// THE GAME //
//////////////
// const p = document.querySelector('#pause')
// p.addEventListener('click', function(){
//   clearInterval(gameInterval)
// })

////////////////
// TEST CASES //
////////////////
function test(){
  const testCases = []
  for (let i = 0; i < 500; i++) {
    testCases.push(findNearest([1, 4]))
  }
  console.log(testCases);
  console.log({history});

}

////////////////
// TEST CASES //
////////////////

const rows = 20
const cols = 20
function getRandomElem(){
  return Math.floor(Math.random() * 1079) + 1
}
const colrs = {
  "Green":["greeny","olive"],
  "Red":["dark-red","killed"],
  "Blue":["spaceXClouds","cloudy"],
  "Purple":["laen","afterEffect"]
}
function getColor(elem){
  const colNames = ff(elem)
  return [colrs[colNames[0]][Math.floor(Math.random() * 2)],colNames[1]]
}
function getFilter(){
  return ["scale3d","skew","rotate3D","rotateZ","translateX","translateY","translateZ"][Math.floor(Math.random() * 7)]
}
async function updateAnimationRandom(){
  for (let i = 0; i < 69; i++) {
    const elem = getRandomElem()
    const div = document.querySelector(`div[gp="${elem}"]`)
    const color = getColor(elem)
    const filter = getFilter()
    div.classList.add(color[0])
    setTimeout(()=>{div.classList.add(filter)},66)
    const whichShake = color[1]

    setTimeout(()=>{
      div.classList.remove(color[0],filter)
    },300+(10*i*i))

    setTimeout(()=>{
      div.classList.add(whichShake)
    },2000+(10*i*i))


    setTimeout(()=>{
      div.classList.remove(whichShake)
    },6000+(10*i*i))


  }
  await new Promise(r => setTimeout(r, 900));
  updateAnimationRandom()
}



function ff(elem){
  i=0
  let cName = "",flake=""
  while (true) {
    i+=20
    const isOppCol = !cName.length || cName == "Green" ? true : false
    flake = isOppCol ? 'shake' : 'shake-fast'
    cName = isOppCol ? ["Purple","Blue"][Math.floor(Math.random() * 2)] : "Green"
     if (i>=1079 || elem <= i) {
       break
     }
  }
  return [cName,flake]
}
// updateAnimationRandom()