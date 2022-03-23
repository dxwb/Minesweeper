import {Renderer} from './Renderer'
import {SceneManager} from './SceneManager'
import {Map} from './Map'
import global from './global'
import resouces from '../resouces/R.json'

export class Game{
  constructor(options){
    this.renderer = global.renderer = new Renderer(options.el)
    this.ctx = global.ctx = this.renderer.context
    global.game = this
    this.sm = global.sm = new SceneManager()
    this.R = global.R = {}
    this.fno = 0

    this.init()
  }

  loop(){
    this.sm.render()
    this.timer = requestAnimationFrame(this.loop.bind(this))
  }

  start(){
    this.map = new Map()
    this.loop()
  }

  init(){
    this.renderLoading(0, 1)

    const len = resouces.images.length
    let loadedCount = 0

    resouces.images.forEach(el => {
      const img = new Image()
      img.src = el.url
      img.onload = () => {
        this.renderLoading(++loadedCount, len)
      }
      this.R[el.name] = img
    })
  }

  renderLoading(loadedCount, total){
    this.ctx.clearRect(0, 0, this.renderer.width, this.renderer.height)
    this.ctx.fillStyle = '#666666'
    this.ctx.font = '18px youyuan'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`正在加载：${parseInt(loadedCount / total * 100)}%`, this.renderer.width / 2, this.renderer.height * .382)

    if(loadedCount >= total){
      this.start()
    }
  }
}
