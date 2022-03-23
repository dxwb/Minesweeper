export class Renderer{
  constructor(selector){
    this.canvas = document.querySelector(selector)
    this.context = this.canvas.getContext('2d')

    const screenW = window.innerWidth
    const screenH = window.innerHeight
    this.width = this.canvas.width = screenW > 750 ? screenH * 375 / 667 : Math.max(screenW, 320)
    this.height = this.canvas.height = screenH
  }

  on(eventName, callback){
    this.canvas.addEventListener(eventName, callback)
  }
}
