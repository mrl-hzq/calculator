import {useReducer} from "react";
import "./style.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

//Global Variable
 export const ACTIONS = {   
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Ensure that user can overide the value instead of adding to previous value
      if (state.overwrite) {
        return {
          ...state, //current state spread out
          currentOperand: payload.digit,
          overwrite: false,
        }

      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) { 
        return state
      } 

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""} ${payload.digit}`,
      }

      case ACTIONS.CHOOSE_OPERATION:
      // IF theres nothing in currentOperand/previousOperand no operation
      if (state.currentOperand == null && state.previousOperand == null) {
        return state 
      }
      
      // So that user can change operation
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      // Ensure current opperand become previous operand
      if (state.previousOperand == null) {
        return {
          ...state, // spread state
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      // Default action
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation, // Call operation that user click on
        currentOperand: null
      }

      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return{
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) {
          return {...state, currentOperand: null}
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      
      case ACTIONS.EVALUATE:
        // To ensure they are appropiate value to evaluate
        if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state
        }
        
        // Calculation
        return {
          ...state,
          overwrite: true, 
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) { //takes in state
  const prev = parseFloat(previousOperand)   //convert string to number
  const current = parseFloat(currentOperand) //convert string to number
  if (isNaN(prev) || isNaN(current)) return "" // Return empty string if no number
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString() //Return computation and change to string
}



function App() {
  const [{currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,{})
  

  return (
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
          <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
          <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
          <OperationButton operation= "÷" dispatch={dispatch} />
          <DigitButton digit= "1" dispatch={dispatch} />
          <DigitButton digit= "2" dispatch={dispatch} />
          <DigitButton digit= "3" dispatch={dispatch} />
          <OperationButton operation= "*" dispatch={dispatch} />
          <DigitButton digit= "4" dispatch={dispatch} />
          <DigitButton digit= "5" dispatch={dispatch} />
          <DigitButton digit= "6" dispatch={dispatch} />
          <OperationButton operation= "+" dispatch={dispatch} />
          <DigitButton digit= "7" dispatch={dispatch} />
          <DigitButton digit= "8" dispatch={dispatch} />
          <DigitButton digit= "9" dispatch={dispatch} />
          <OperationButton operation= "-" dispatch={dispatch} />
          <DigitButton digit= "." dispatch={dispatch} />
          <DigitButton digit= "0" dispatch={dispatch} />
          <button className = "span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
  
  )
}


export default App;

