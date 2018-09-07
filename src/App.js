import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const Room = require('ipfs-pubsub-room')
const IPFS = require('ipfs')
const ipfs = new IPFS({
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
})



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:""
    }
  }
  componentDidMount(){

    // IPFS node is ready, so we can start using ipfs-pubsub-room
    ipfs.on('ready', () => {
      const room = Room(ipfs, 'room-name')

      room.on('peer joined', (peer) => {
        console.log('Peer joined the room', peer)
      })

      room.on('peer left', (peer) => {
        console.log('Peer left...', peer)
      })

      // now started to listen to room
      room.on('subscribed', () => {
        console.log('Now connected!')
      })

      room.on('message', (message) => {

        console.log("message:",message,message.data.toString())

      })
    })
  }
  handleInput(e){
    let update = {}
    update[e.target.name] = e.target.value
    this.setState(update)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
        <input
                style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="message" value={this.state.message} onChange={this.handleInput.bind(this)}
            /> <button size="2" onClick={async ()=>{
              const room = Room(ipfs, 'room-name')
              room.broadcast(this.state.message)
              this.setState({message:""})
            }}>
              Broadcast
            </button>
        </p>
      </div>
    );
  }
}

export default App;
