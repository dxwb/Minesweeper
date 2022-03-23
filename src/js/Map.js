import {Sprite} from './Sprite'
import {Cell} from './Cell'
import {Land} from './Land'
import {Mine} from './Mine'
import {MineNumber} from './MineNumber'
import {SceneManager} from './SceneManager'
import global from './global'
import {randomInt} from './utils'

export class Map{
  constructor(){
    Map.WH = global.renderer.width - Map.X * 2
    Map.Y = global.renderer.height / 2 - Map.WH / 2
    Sprite.WH = Map.WH / 10

    // 创建二维数组
    this.code = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    this.cells = Array.from({
      length: Map.ROW_NUMBER
    },
    () => new Array(Map.COL_NUMBER))

    this.initMineCode()
    this.init()
  }

  extendDig(row, col){
    const {code, cells} = this
    const adjacent = this.getAdjacent(row, col)
    const adjacentLen = adjacent.length

    for(let i = 0; i < adjacentLen; i += 2){
      const row = adjacent[i]
      const col = adjacent[i + 1]

      if(row < 0 || row >= Map.ROW_NUMBER){
        continue
      }

      const adjacentCell = cells[row][col]
      const adjacentCode = code[row][col]
      // 这个相邻的格子不是空格，不做处理
      if(adjacentCode !== Map.SPACE){
        // 如果是数字，将土地刨开
        if(adjacentCode === Map.MINE_NUMBER){
          adjacentCell.dig()
        }
        continue
      }
      // 这个格子已经被点击过了或者被插了旗子
      const {land} = adjacentCell
      if(land.clicked || land.hasFlag)continue

      adjacentCell.dig()
      // 递归
      this.extendDig(row, col)
    }
  }

  onClick(ev){
    const [row, col] = this.getRowColByXY(ev.offsetX, ev.offsetY)
    if(!row && row !== 0)return

    const {cells, code} = this
    const cell = cells[row][col]
    const currentCode = code[row][col]
    // 如果这块地已经被挖过，跳出函数
    if(cell.land.clicked)return

    cell.dig()
    switch(currentCode){
      case Map.SPACE:
        // 如果挖到空地，延伸相邻的空地
        this.extendDig(row, col)
        break
      case Map.MINE:
        if(cell.land.hasFlag)break
        // 如果挖到地雷，结束
        global.sm.enter(SceneManager.LOSE)
        return
    }
    // 判断胜利
    const cellsLen = cells.length
    for(let row = 0; row < cellsLen; row++){
      const rowEl = cells[row]
      const rowElLen = rowEl.length

      for(let col = 0; col < rowElLen; col++){
        const el = rowEl[col]
        // 没有雷并且没有被挖，继续
        if(!el.mine && !el.land.clicked)return
      }
    }
    // 胜利
    global.sm.enter(SceneManager.VICTORY)
  }

  onContextMenu(ev){
    const [row, col] = this.getRowColByXY(ev.offsetX, ev.offsetY)
    if(!row && row !== 0)return

    this.cells[row][col].toggleFlag()
  }

  // 创建地雷代码
  initMineCode(){
    const {code} = this
    for(let i = 0; i < Map.MINE_COUNT; i++){
      const [row, col] = this.randomCoor()
      // 如果生成的坐标上已经有雷，那么此次循环作废并重来
      if(code[row][col] === Map.MINE){
        i--
        continue
      }
      code[row][col] = Map.MINE
    }
  }

  init(){
    const {code, cells} = this
    // 创建土地矩阵
    const codeLen = code.length
    for(let row = 0; row < codeLen; row++){
      const rowEl = code[row]
      const rowElLen = rowEl.length

      for(let col = 0; col < rowElLen; col++){
        const el = rowEl[col]
        const x = Map.X + Sprite.WH * col
        const y = Map.Y + Sprite.WH * row
        let mine = null
        let mineNumber = null
        // 数字为0判断周围地雷数量，为1创建地雷
        if(el === Map.SPACE){
          const mineCount = this.getMineCount(row, col)
          if(mineCount > 0){
            code[row][col] = Map.MINE_NUMBER
            mineNumber = new MineNumber(x, y, row, col, mineCount)
          }
        }else if(el === Map.MINE){
          mine = new Mine(x, y, row, col)
        }
        cells[row][col] = new Cell({
          land: new Land(x, y, row, col),
          mine,
          mineNumber
        })
      }
    }
  }

  render(){
    const {cells} = this

    global.ctx.fillStyle = '#f5f5f5'
    global.ctx.fillRect(Map.X, Map.Y, Map.WH, Map.WH)

    const spriteLen = cells.length
    for(let i = 0; i < spriteLen; i++){
      const rowEl = cells[i]
      const rowElLen = rowEl.length

      for(let j = 0; j < rowElLen; j++){
        rowEl[j].render()
      }
    }
  }

  // 根据xy获取行号列号
  getRowColByXY(x, y){
    const row = Math.floor((y - Map.Y) / Sprite.WH)
    const col = Math.floor((x - Map.X) / Sprite.WH)
    if(
      row < 0 || row >= Map.ROW_NUMBER ||
      col < 0 || col >= Map.COL_NUMBER
    ){
      return []
    }

    return [row, col]
  }

  // 获取某个格子相邻的8个格子坐标
  getAdjacent(row, col){
    return [
      row,
      col - 1,
      row - 1,
      col - 1,
      row - 1,
      col,
      row - 1,
      col + 1,
      row,
      col + 1,
      row + 1,
      col + 1,
      row + 1,
      col,
      row + 1,
      col - 1
    ]// 当前格子8个方向的格子坐标
  }

  // 计算格子周围地雷数量
  getMineCount(row, col){
    const {code} = this
    const adjacent = this.getAdjacent(row, col)// 当前格子8个方向的格子坐标
    let count = 0

    for(let i = 0; i < adjacent.length; i += 2){
      const row = adjacent[i]
      const col = adjacent[i + 1]
      // 数组越界
      if(row < 0 || row >= Map.ROW_NUMBER){
        continue
      }

      if(code[row][col] === Map.MINE){
        count++
      }
    }

    return count
  }

  // 生成随机的x,y坐标
  randomCoor(){
    return [randomInt(0, 9), randomInt(0, 9)]
  }
}

Map.ROW_NUMBER = 10
Map.COL_NUMBER = 10
Map.X = 6
Map.Y = 0
Map.WH = 300
Map.MINE_COUNT = 10
// 空白是0，地雷是1，数字是2
Map.SPACE = 0
Map.MINE = 1
Map.MINE_NUMBER = 2
