import {Sprite} from './Sprite'
import global from './global'

export class Land extends Sprite{
  constructor(x, y, row, col){
    super(x, y, row, col)
    this.color = '#abc'
    this.clicked = false// 是否被点击过
    this.hasFlag = false// 是否被标记
  }

  render(){
    if(this.clicked)return

    global.ctx.fillStyle = this.color || 'rgba(0, 0, 0, 0)'
    global.ctx.fillRect(this.x, this.y, Sprite.WH, Sprite.WH)
    // 如果已被标记，画上标记符号
    if(this.hasFlag){
      const half = Sprite.WH / 2
      global.ctx.textBaseline = 'middle'
      global.ctx.textAlign = 'center'
      global.ctx.fillText('🚩', this.x + half, this.y + half, Sprite.WH)
    }
  }
}
