export class Sprite{
  constructor(x, y, row, col){
    this.x = x
    this.y = y
    this.row = row
    this.col = col
  }

  render(){
    throw new Error('必须实现render方法')
  }
}

Sprite.WH = 30
