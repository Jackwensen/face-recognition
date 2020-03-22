import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

import 'tachyons';

const app = new Clarifai.App({
  apiKey: '4524986a4e7d42f8b05b185c8e362cda'
 });

const ParticlesOptions = {
  "particles": {
    "number": {
        "value": 160,
        "density": {
            "enable": false
        }
    },
    "size": {
        "value": 10,
        "random": true
    },
    "move": {
        "direction": "bottom",
        "out_mode": "out"
    },
    "line_linked": {
        "enable": false
    }
},
  "interactivity": {
      "events": {
          "onclick": {
              "enable": true,
              "mode": "remove"
          }
      },
      "modes": {
          "remove": {
              "particles_nb": 10
          }
      }
  }
}

const initState = {
  input:'',
  imageUrl:'',
  box: {},
  route:'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initState;
  }

  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage')
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol : clarifyFace.left_col * width,
      topRow : clarifyFace.top_row * height,
      rightCol : width - (clarifyFace.right_col * width),
      bottomRow : height - (clarifyFace.bottom_row * height)

    }
  }

  displayBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => {
        if(response) {
          fetch('https://enigmatic-spire-85293.herokuapp.com/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries : count}))
          })
        }
        this.displayBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(this.err))
  }

  onRouteChange = (route) => {
    this.setState({route: route})
    if(route === 'signout') {
      this.setState(initState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }

  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={ParticlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
            :
          (
            this.state.route === 'signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

          )
          
        }
      </div>
    );
  }
}

export default App;
