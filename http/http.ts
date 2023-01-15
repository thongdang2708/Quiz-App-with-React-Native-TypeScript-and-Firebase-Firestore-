
import { variables } from "../store/firestore/firestore";
import { getDocs, collection, query, DocumentData } from "firebase/firestore";
import { COLLECTION_NAME } from "@env";

const db = variables.db;

//Fetch Quiz

export const fetchQuiz = async () => {

    let querySnapShot = collection(db, COLLECTION_NAME.toString());

    let allDocs = await getDocs(querySnapShot);

    let results : DocumentData[] = [];

    allDocs.forEach((doc) => {
        let quiz = doc.data();
        quiz.id = doc.id;
        results.push(quiz);
    });
    
    return results;

};