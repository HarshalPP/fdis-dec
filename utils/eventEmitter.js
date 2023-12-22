const{EventEmitter}=require('events')
const eventEmitter=new EventEmitter()
console.log("EventEmitter is called",eventEmitter)
module.exports=eventEmitter