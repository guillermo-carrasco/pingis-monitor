import { Observable } from 'rxjs/Observable'

export const socket = new EventSource('/subscribe')

export const socket$ = Observable.create((observable) => {
  socket.onmessage = (e) => {
    observable.next(JSON.parse(e.data.replace(/'/g, '"')))
  //   const phantomEvent =
  //   switch (phantomEvent.name) {
  //     case 'TableStatus':
  //       changeTaleStatus(phantomEvent.data)
  //       break
  //     case 'WhiteCounter':
  //       changeWhiteCounter(phantomEvent.data)
  //     case 'RedCounter':
  //       changeRedCounter(phantomEvent.data)
  //     default:
  //       break
  //   }
  // }
  }
})
  .share()
