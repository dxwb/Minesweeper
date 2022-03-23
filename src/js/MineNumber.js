import {Sprite} from './Sprite'
import global from './global'

export class MineNumber extends Sprite{
  constructor(x, y, row, col, count = 1){
    super(x, y, row, col)
    this.count = count
  }

  render(){
    const half = Sprite.WH / 2
    global.ctx.fillStyle = '#f00'
    global.ctx.textBaseline = 'middle'
    global.ctx.textAlign = 'center'
    global.ctx.fillText(this.count.toString(), this.x + half, this.y + half, Sprite.WH)
  }
}
