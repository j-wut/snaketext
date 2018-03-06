import React, { Component } from 'react';
import KeyHandler, {KEYPRESS} from 'react-key-handler';
import logo from './logo.svg';
import black from './black.png';
import white from './white.png';
import red from './red.png';
import './App.css';

function Cell(props){
  switch(props.value){
    case "1": return <img src={black} alt="snake"/>;
    case "2": return <img src={red} alt="food"/>;
    default: return <img src={white} alt="blank"/>;
  }
}
function Grid(props){
  var ret = [];
  for (var x=0;x<props.size;x++){
    var cells = [];
    for(var y=0;y<props.size;y++){
      cells.push(<Cell key={x*10+y} value={props.stuff[x][y]}/>);
    }
    ret.push(<div className="row">{cells}</div>);
  }
  return (<div>{ret}</div>);
}

class Game extends Component{
  constructor(props){
    super(props);
    this.state={
      size: 10,
      snake: Array(3).fill(Array(2).fill(0)),
      food: Array(2).fill(4),
      dir: "ArrowRight",
    };
    this.timeInterval = setInterval(this.update.bind(this), 150);
  }

  handleKeyPress(event){
    this.setState({dir:event.key});
  }
  resetGame(){
    this.setState({
      size: 10,
      snake: Array(3).fill(Array(2).fill(0)),
      food: Array(2).fill(4),
      dir: "ArrowRight",
    });
  }
  render(){
    var temp = [];
    for (var i=0;i<10;i++){
      temp.push(Array(this.state.size).fill('0'));
    }
    for(i=0;i<this.state.snake.length;i++){
      temp[this.state.snake[i][0]][this.state.snake[i][1]]='1';
    }
    temp[this.state.food[0]][this.state.food[1]]='2';
    return (
      <div className="grid">
      <KeyHandler keyEventName={KEYPRESS} keyValue="ArrowDown" onKeyHandle={this.handleKeyPress.bind(this)} /> 
      <KeyHandler keyEventName={KEYPRESS} keyValue="ArrowUp" onKeyHandle={this.handleKeyPress.bind(this)} /> 
      <KeyHandler keyEventName={KEYPRESS} keyValue="ArrowRight" onKeyHandle={this.handleKeyPress.bind(this)} /> 
      <KeyHandler keyEventName={KEYPRESS} keyValue="ArrowLeft" onKeyHandle={this.handleKeyPress.bind(this)} /> 
      <Grid size={this.state.size} stuff={temp}/>
      </div>
    );
  }
  update(){
    if(this.state.dir){
      var snake = this.state.snake.slice();
      var food = this.state.food.slice();
      var next = snake[0].slice();

      switch(this.state.dir){
        case 'ArrowLeft': next[1]--; break;
        case 'ArrowRight': next[1]++; break;
        case 'ArrowUp': next[0]--; break;
        case 'ArrowDown': next[0]++; break;
        default: return;
      }
      if (next[0]<0 || next[0]>=10 || next[1]<0 || next[1]>=10){
        this.resetGame(); //wall
        return;
      }
      for (var i = 0 ; i<snake.length;i++){
        if ( next[0]===snake[i][0] && next[1]===snake[i][1]){
          this.resetGame(); //sd
          return;
        }
      }
      if (next[0]===food[0] && next[1]===food[1]){
          food= [];
          food.push(Math.floor(Math.random()*10)); // grow
          food.push(Math.floor(Math.random()*10));
          this.setState({food:food});
          snake.unshift(next);
          this.setState({snake:snake});
      }else{
        snake.unshift(next); //no grow
        snake.pop();
        this.setState({snake:snake});
      }
    }
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Snake in React</h1>
        </header>
        <p className="App-intro">
          Check App.js for the source!
        </p>
          <Game/>
      </div>
    );
  }
}

export default App;
