import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import logo from './logo.svg';
import './App.css';

const Session = 'Session';
const Break = 'Break'

const defaultSessionDisplay = 25;
const defaultBreakDisplay = 5;
const defaultDisplayTime = '25:00';
const App = () => {

  const [mode, setMode] = useState('Session')
  const [timeLeft, setTimeLeft] = useState({ minutes: defaultSessionDisplay, seconds: 0 })
  const [timeDisplay, setTimeDisplay] = useState(defaultDisplayTime)
  const [tickTimer, setTickTimer] = useState(false)

  const [intervalId, setIntervalId] = useState(null)

  const [breakTimeDisplay, setBreakTimeDisplay] = useState(defaultBreakDisplay)
  const [sessionDisplay, setSessionDisplay] = useState(defaultSessionDisplay)

  useEffect(() => {
    //switch time left based on the mode switch 
    let minutes = mode === Session ? sessionDisplay : breakTimeDisplay
    setTimeLeft({ minutes, seconds: 0 })

    let formattedTime = formatDisplayTime(minutes, 0)
    setTimeDisplay(formattedTime)
  }, [mode])

  const switchTimeMode = () => {
    let nextMode = mode === Break ? Session : Break
    setMode(nextMode)

    //play audio beep
    let audio = document.getElementById('beep')
    audio.play()
  }

  useEffect(() => {
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      if (tickTimer) {
        subtractASecond()
      }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
  }, [timeLeft, tickTimer]);


  const subtractASecond = () => {
    let { minutes, seconds } = timeLeft; //'25', '00'
    console.log(timeLeft, minutes, seconds)
    if (!minutes && !seconds) {
      // when reaching 0 switch modes
      switchTimeMode()
    } else {
      console.log('sessiontimer', timeLeft) // {minutes seconds}

      if (!seconds) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      setTimeLeft({ minutes, seconds });

      let formattedTime = formatDisplayTime(minutes, seconds)
      setTimeDisplay(formattedTime)
    }
  }

  const formatDisplayTime = (minutes, seconds) => {
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
  }

  const reset = () => {
    console.log('resetting')
    //set back to defaults
    setBreakTimeDisplay(defaultBreakDisplay)
    setSessionDisplay(defaultSessionDisplay)
    setTimeDisplay(defaultDisplayTime)
    setTickTimer(false)
    setMode(Session)

    let audio = document.getElementById('beep')
    audio.load()
  }

  useEffect(() => {
    let minutes = mode === Session ? sessionDisplay : breakTimeDisplay
    setTimeLeft({ minutes, second: 0 })
    let formattedTime = formatDisplayTime(minutes, 0)
    setTimeDisplay(formattedTime)
  }, [breakTimeDisplay, sessionDisplay]);

  const updateDisplayTime = (timeChange, modeToUpdate) => {
    let time = modeToUpdate === Break ? breakTimeDisplay : sessionDisplay
    time += timeChange

    if (time >= 1 && time <= 60 && !tickTimer) {
      switch (modeToUpdate) {
        case Break:
          setBreakTimeDisplay(time)
          break;
        case Session:
          setSessionDisplay(time)
          break;
        default:
          setSessionDisplay(time)
      }
    }
  }


  const startStop = () => {
    setTickTimer(!tickTimer)
    console.log('start stop')
  }

  return (
    <div className="App">

      <div className='length-controls'>
        <div>
          <div id='break-label'>Break Length</div>
          <span id='break-decrement' onClick={() => updateDisplayTime(-1, Break)}>
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
          <span id='break-length'>{breakTimeDisplay}</span>
          <span id='break-increment' onClick={() => updateDisplayTime(1, Break)}>
            <FontAwesomeIcon icon={faArrowUp} />
          </span>
        </div>

        <div>
          <div id='session-label'>Session Length</div>
          <span id='session-decrement' onClick={() => updateDisplayTime(-1, Session)}>
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
          <span id='session-length'>{sessionDisplay}</span>
          <span id='session-increment' onClick={() => updateDisplayTime(1, Session)}>
            <FontAwesomeIcon icon={faArrowUp} />
          </span>
        </div>

      </div>



      <div className='main-display'>
        <div id='timer-label'>{mode}</div>
        <div id='time-left'>{timeDisplay}</div>

        <div className='display-controls'>
          <span id='start_stop' onClick={startStop}>
            <FontAwesomeIcon icon={faPlay} />
            <FontAwesomeIcon icon={faPause} />
          </span>
          <span id='reset' onClick={reset}>Reset</span>
        </div>

      </div>

      <audio id='beep' src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'></audio>
    </div>
  );
}

export default App;
