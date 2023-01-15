
import { DocumentData } from "firebase/firestore";
import { createContext } from "react";
import {useReducer} from "react";
import {useState} from "react";
import {fetchQuiz} from "../../http/http";

interface ChildrenProp {
    children: React.ReactNode
}

interface Quiz {
    arrayQuiz: DocumentData[]
}

interface ContextSetUp {
    arrayQuiz: Quiz["arrayQuiz"] | [] | undefined | null,
    saveQuiz: (array: Quiz["arrayQuiz"] | []) => void
}

const defaultValues : ContextSetUp = {
    arrayQuiz: [],
    saveQuiz: (array: Quiz["arrayQuiz"] | []) => {}
};

const QuizContext = createContext<ContextSetUp>(defaultValues);

interface State {
    arrayQuiz: Quiz["arrayQuiz"] | []
}

interface Action {
    type: "SAVE_QUIZ",
    payload?: any
}

const QuizReducer = (state: State, action : Action) => {

    switch (action.type) {
        case "SAVE_QUIZ": 
            return {
                ...state,
                arrayQuiz: action.payload
            }
        default:
            return state
    }
}

interface initialState {
    arrayQuiz: Quiz["arrayQuiz"] | []
}

export const QuizProvider = ({children} : ChildrenProp) => {

    const initialState : initialState= {
        arrayQuiz: []
    }

    const [state, dispatch] = useReducer(QuizReducer, initialState);

    const saveQuiz = async (array : Quiz["arrayQuiz"]) => {

        dispatch({
            type: "SAVE_QUIZ",
            payload: array
        })

    }



    return (<QuizContext.Provider value={{
        arrayQuiz: state.arrayQuiz,
        saveQuiz: saveQuiz
    }}>
        {children}
    </QuizContext.Provider>)
}



export default QuizContext;
