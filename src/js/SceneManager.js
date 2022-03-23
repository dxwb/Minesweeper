import {Scene} from './Scene'
import global from './global'

// 场景管理器
export class SceneManager{
  constructor(){
    this.currentScene = SceneManager.PLAYING
    this.scenes = []

    this._init()
    this._bind()
  }

  enter(scene){
    this.currentScene = scene
  }

  render(){
    const {ctx, renderer, game} = global
    ctx.clearRect(0, 0, renderer.width, renderer.height)
    // 渲染场景
    this.scenes[this.currentScene].render()
    // 渲染帧编号
    ctx.fillStyle = '#666666'
    ctx.textAlign = 'left'
    ctx.font = '20px youyuan'
    ctx.fillText(`FNO:${game.fno}`, 10, 20)
    // 渲染场景号
    ctx.fillText(`scene:${game.sm.currentScene}`, 10, 40)
    game.fno++
  }

  // 失败场景
  _loseScene(){
    const {game, ctx, renderer} = global

    this.scenes[SceneManager.LOSE] = new Scene({
      props: {
        maskAlpha: 0,
        loseImgScale: 0
      },
      render(){
        game.map.render()

        const renderW = renderer.width
        const renderH = renderer.height
        // 绘制半透明遮罩
        if(this.maskAlpha < .5){
          this.maskAlpha += .5 / 20
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${this.maskAlpha})`
        ctx.fillRect(0, 0, renderW, renderH)
        // 绘制胜利文字图片
        const loseImage = global.R.lose
        if(this.loseImgScale < 1){
          this.loseImgScale += 1 / 20
        }
        ctx.save()
        ctx.translate(renderW / 2, renderH * (1 - .618))
        ctx.scale(this.loseImgScale, this.loseImgScale)
        ctx.drawImage(
          loseImage,
          -loseImage.width / 2,
          -loseImage.height / 2
        )
        ctx.restore()
      },
      eventHandle: {
        click(){
          console.log(1)
        },
        contextmenu(){}
      }
    })
  }

  // 胜利场景
  _victoryScene(){
    const {game, ctx, renderer} = global

    this.scenes[SceneManager.VICTORY] = new Scene({
      props: {
        maskAlpha: 0,
        winImgScale: 0
      },
      render(){
        game.map.render()

        const renderW = renderer.width
        const renderH = renderer.height
        // 绘制半透明遮罩
        if(this.maskAlpha < .5){
          this.maskAlpha += .5 / 20
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${this.maskAlpha})`
        ctx.fillRect(0, 0, renderW, renderH)
        // 绘制胜利文字图片
        const winImage = global.R.win
        if(this.winImgScale < 1){
          this.winImgScale += 1 / 20
        }
        ctx.save()
        ctx.translate(renderW / 2, renderH * (1 - .618))
        ctx.scale(this.winImgScale, this.winImgScale)
        ctx.drawImage(
          winImage,
          -winImage.width / 2,
          -winImage.height / 2
        )
        ctx.restore()
      },
      eventHandle: {
        click(){
          console.log(2)
        },
        contextmenu(){}
      }
    })
  }

  // 进行中场景
  _playingScene(){
    const {game} = global

    this.scenes[SceneManager.PLAYING] = new Scene({
      render(){
        game.map.render()
      },
      eventHandle: {
        click(ev){
          game.map.onClick(ev)
        },
        contextmenu(ev){
          game.map.onContextMenu(ev)
        }
      }
    })
  }

  // 首页场景
  _welcomeScene(){
    this.scenes[SceneManager.WELCOME] = new Scene({})
  }

  _init(){
    // 首页场景
    this._welcomeScene()
    // 进行中场景
    this._playingScene()
    // 胜利场景
    this._victoryScene()
    // 失败场景
    this._loseScene()
  }

  _bind(){
    global.renderer.on('click', (ev) => {
      this.scenes[this.currentScene].eventHandle.click(ev)
    })

    global.renderer.on('contextmenu', (ev) => {
      ev.preventDefault()
      this.scenes[this.currentScene].eventHandle.contextmenu(ev)
    })
  }
}

SceneManager.WELCOME = 0
SceneManager.PLAYING = 1
SceneManager.VICTORY = 2
SceneManager.LOSE = 3
