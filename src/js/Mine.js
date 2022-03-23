import {Sprite} from './Sprite'
import global from './global'

export class Mine extends Sprite{
  constructor(x, y, row, col){
    super(x, y, row, col)
    this.color = '#d11'
  }

  render(){
    const half = Sprite.WH / 2
    global.ctx.textBaseline = 'middle'
    global.ctx.textAlign = 'center'
    global.ctx.fillText('💣', this.x + half, this.y + half, Sprite.WH)
  }
}
