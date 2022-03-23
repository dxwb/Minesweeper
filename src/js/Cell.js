export class Cell{
  constructor({land, mine, mineNumber}){
    this.land = land
    this.mine = mine
    this.mineNumber = mineNumber
  }

  render(){
    if(this.land.clicked){
      this.mine && this.mine.render()
      this.mineNumber && this.mineNumber.render()
    }
    this.land.render()
  }

  dig(){
    const {land} = this
    if(!land.clicked && !land.hasFlag){
      land.clicked = true
    }
  }

  toggleFlag(){
    const {land} = this
    if(!land.clicked){
      land.hasFlag = !land.hasFlag
    }
  }
}
