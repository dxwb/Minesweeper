export class Scene{
  constructor({render, update, eventHandle, props = {}}){
    this.render = render
    this.update = update
    this.eventHandle = eventHandle

    for(const k in props){
      if(Object.hasOwnProperty.call(props, k)){
        const el = props[k]
        this[k] = el
      }
    }
  }
}
