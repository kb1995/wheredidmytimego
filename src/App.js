import React, { Component } from 'react';
import './App.css';
import moment from 'moment'
import randomColor from 'randomcolor'
import { ParentDiv, Popup, TextInput, Flex } from './App.styled'

// random colors
const lightColors = randomColor({ hue: 'green',luminosity: 'light', count: 20 });
const darkColors = randomColor({ hue: 'red', luminosity: 'dark', count: 20 });

const initialState = {
  text: '',
  checked: true,
  reportGenerated: false,
  activityArray: [],
  activityObj: {
    text: '',
    time: '',
    percentage: null,
    category: null,
  },
  otherStatistics: {
    startTime: null,
    endTime: null,
    duration: null,
    productivePer: null,
    unproductivePer: null,
    longestTask: null,
    shortestTask: null,
  }
}

class App extends Component {
  state = initialState

  // local storage 
  componentWillMount() {
    let local = localStorage.getItem("items")
    local = JSON.parse(local)

    if (local) {
      this.setState(local)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem("items", JSON.stringify(nextState))
  }

  handleChangeInput = (e) => {
    this.setState({ text: e.target.value });
  }

  handleCategory = () => {
    this.setState({
      checked: !this.state.checked
    })
  }

  handleAdd = (e) => {
    if (e.which === 13) {
      if (this.state.text) {
        var time = new Date().toLocaleTimeString();
        let newActivity = this.state.activityObj
        newActivity.text = this.state.text
        newActivity.time = time
        newActivity.category = this.state.checked

        this.setState({
          activityArray: [...this.state.activityArray, newActivity],
          text: '',
          activityObj: {
            text: '',
            time: '',
            percentage: null,
            category: null,
          }
        })
      }
    }
  }

  handleAddviaButton = () => {
    if (this.state.text) {
      var time = new Date().toLocaleTimeString();
      let newActivity = this.state.activityObj
      newActivity.text = this.state.text
      newActivity.time = time
      newActivity.category = this.state.checked

      this.setState({
        activityArray: [...this.state.activityArray, newActivity],
        text: '',
        activityObj: {
          text: '',
          time: '',
          percentage: null,
          category: null,
        }
      })
    }
  }

  handleReport = () => {
    let updated_activityArray = this.state.activityArray;
    let startTime = moment(this.state.activityArray[0].time, 'HH:mm:ss')
    var time = new Date().toLocaleTimeString()
    let endTime = moment(time, 'HH:mm:ss')
    let totalTime = endTime - startTime

    for (let i = 1; i < this.state.activityArray.length; i++) {
      let item = moment(this.state.activityArray[i].time, 'HH:mm:ss')
      let percentage = ((item - moment(this.state.activityArray[i - 1].time, 'HH:mm:ss')) / totalTime) * 100
      updated_activityArray[i - 1].percentage = percentage
    }

    // add the end here

    let newActivity = this.state.activityObj
    newActivity.text = 'end'
    newActivity.time = time
    newActivity.category = false
    newActivity.percentage = null;
    updated_activityArray.push(newActivity)

    updated_activityArray[updated_activityArray.length - 2].percentage = ((moment(time, 'HH:mm:ss') - moment(updated_activityArray[updated_activityArray.length - 2].time, 'HH:mm:ss')) / totalTime) * 100
    this.setState({
      activityArray: updated_activityArray,
      reportGenerated: true,
    }, () => { this.OtherStatistics() })
  }

  OtherStatistics = () => {
    // TODO

    let stats = this.state.otherStatistics

    // start time
    stats.startTime = this.state.activityArray[0].time

    // finish time
    stats.endTime = this.state.activityArray[this.state.activityArray.length - 1].time

    // duration
    var seconds = (moment(stats.endTime, 'HH:mm:ss') - moment(stats.startTime, 'HH:mm:ss')) / 1000
    stats.duration = moment().startOf('day').seconds(seconds).format('H:mm:ss');

    // longest activity

    // shortest activity


    this.setState({
      otherStatistics: stats
    })
  }

  handleReset = () => {
    this.setState(initialState)
  }

  handleDelete = (idx) => {
    this.state.activityArray.splice(idx, 1)
    this.setState({
      activityArray: this.state.activityArray,
    })
  }

  handleGoBack = () => {
    this.state.activityArray.pop()

    this.setState({
      activityArray: this.state.activityArray,
      reportGenerated: false,
    })
  }


  render() {
    // output stuff
    const outputList = this.state.activityArray.map((item, idx) => {
      return (
        <tr key={idx} className={item.category ? 'table-success' : 'table-danger'}>
          <td>{item.text}</td>
          <td>{item.time}</td>
          <td>{item.category ? 'Yes' : 'No'}</td>
          <td><button onClick={() => { this.handleDelete(idx) }} className="btn btn-danger font-weight-bold">X</button></td>
        </tr>
      )
    })
    const outputReport = this.state.activityArray.map((item, idx) => {
      return (
        <ParentDiv key={idx} style={{ backgroundColor: `${item.category ? lightColors[idx] : darkColors[idx]}`, width: `${item.percentage}%`, height: '100%' }}>
          <Popup>
            <p style={{ margin: 0 }}>{item.text}</p>
          </Popup>
        </ParentDiv>
      )
    })

    // DOM render windows

    // report screen
    if (this.state.reportGenerated) {
      return (
        <div className="App container">
          <h1>So... here's where my time went 💁</h1>
          <div className="report">
            {outputReport}
          </div>

          <div className='statistics'>
            <p><b>Start time:</b> {this.state.otherStatistics.startTime}</p>
            <p><b>Finish time:</b> {this.state.otherStatistics.endTime}</p>
            <p><b>Duration:</b> {this.state.otherStatistics.duration} hours</p>
          </div>

          <div className="text-center justify-content-center">
            <div onClick={this.handleGoBack} className="btn btn-outline-info mr-3">👈</div>
            <button className="btn btn-primary" onClick={this.handleReset}>Start again</button>
          </div>
        </div>
      )
    }

    // first screen
    return (
      <div className="App container">
        <h2>Where did my time go?? 🏝</h2>

        <Flex onKeyPress={this.handleAdd}>
          <TextInput className="mr-3" placeholder='New activity...' onChange={this.handleChangeInput} value={this.state.text} />
          <button style={{ width: '150px' }} className={`mr-3 btn ${this.state.checked ? 'btn-success' : 'btn-outline-success'}`} onClick={this.handleCategory}>Productive</button>
          <button style={{ width: '150px' }} className={`btn ${this.state.checked ? 'btn-outline-danger' : 'btn-danger'}`} onClick={this.handleCategory}>Unproductive</button>
        </Flex>

        <button onClick={this.handleAddviaButton} className="btn btn-outline-primary my-3">Add Activity</button>

        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Start time</th>
              <th scope="col">Productive?</th>
              <th scope="col">Remove</th>
            </tr>
          </thead>
          <tbody>
            {outputList}
          </tbody>
        </table>


        <button className='btn btn-info' onClick={this.handleReport}>Generate a report</button>
      </div>
    );
  }
}

export default App;
