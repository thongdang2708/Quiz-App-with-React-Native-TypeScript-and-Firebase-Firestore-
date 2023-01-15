import React from 'react';
import {View, Text, StyleSheet, ImageBackground, FlatList, ListRenderItem, Alert, Animated} from "react-native";
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native';
import { fetchQuiz } from '../http/http';
import { useContext } from 'react';
import QuizContext from '../store/context/QuizContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { arrayRemove, DocumentData } from 'firebase/firestore';
import {ColorConstant} from "../constants/colors";
import SingleOption from "../components/SingleOption";
import Button from "../components/component/Button";


interface QuizDeclare {
    currentQuiz: DocumentData, 
    mappedOptions: {
        optionTitle?: string,
        optionText?: string
    } 
};

export function MainScreen() {

    //Set states for main screen
    let {saveQuiz, arrayQuiz} = useContext(QuizContext);
    let [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    let [disable, setDisable] = useState<boolean>(false);
    let [points, setPoints] = useState<number>(0);
    let [title, setTitle] = useState<string | undefined>("");
    let [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);
    //Set state for correct answer
    let [correctOption, setCorrectOption] = useState<string | undefined>("");
    let [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
    
    //Set state for modal
    let [modalOpen, setModalOpen] = useState<boolean>(false);

    // Parse object based on current index
    let parseQuestion : string= "";
    let arrayOfMappedOptions : QuizDeclare["mappedOptions"][] = [];
    let correctAnswer : string = "";
   
    if (arrayQuiz != null || arrayQuiz != undefined || arrayQuiz) {
        parseQuestion = arrayQuiz[currentQuestionIndex]?.question;
        correctAnswer = arrayQuiz[currentQuestionIndex]?.correct;

        let object = arrayQuiz[currentQuestionIndex];

        let keyArrays = [];

        for (let key in object) {
            keyArrays.push(key);
        }

        let mappedArray = keyArrays.map((key) => {

            let newObject : QuizDeclare["mappedOptions"] = {};

            if (key.indexOf("option") > -1) {
                newObject = {
                    optionTitle: key,
                    optionText: object[key]
                }
            }

            return newObject;
        });


        arrayOfMappedOptions = mappedArray.filter((object) => object.optionText);

    }

    //Set animation for progress bar

    let [progress, setProgress] = useState(new Animated.Value(0));

    let progressAim : any;

    if (arrayQuiz != undefined) {
        progressAim = progress.interpolate({
            inputRange: [0, arrayQuiz.length],
            outputRange: ["0%", "100%"]
        })
    }

    //Set function to render progress bar

    const renderProgressBar = () => {

        return (
            <View style={styles.progressBar}>
                <Animated.View style={[styles.animatedView, {width: progressAim}]}/>
            </View>
        )
    };




    //Set effect to fetch quiz from Firebase (Firestore)
   

    useEffect(() => {

        async function getQuizzes () {

            let results = await fetchQuiz();

            saveQuiz(results);
        }

        getQuizzes();

    },[]);

    //Set screen when array of quizzes has length 0

    if (arrayQuiz?.length === 0 || arrayQuiz === null || arrayQuiz === undefined) {
        return (
            <View style={styles.backgroundColorView}> 
            <ImageBackground source={require("../assets/background.jpg")} resizeMode="cover" imageStyle={styles.imageStyle}>
            <SafeAreaView style={styles.screen}>
                <View style={styles.errorPage}>
                    <Text style={styles.errorText}> Fail to fetch </Text>
                </View>
            </SafeAreaView>
            </ImageBackground>
            </View>
        )
    }
    //Handle retry button
    const handleRetry = () => {
        setModalOpen(false);
        setCurrentQuestionIndex(0);
        setDisable(false);
        setPoints(0);
        setTitle("");
        setCorrectOption("");
        setIsCorrect(undefined);
        setNumberOfAnswers(0);

        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
       
    }

    //Set modal when completing all quizzes

    if (modalOpen === true) {
        return (
            <Modal visible={modalOpen} animationType="slide" onRequestClose={handleRetry} >
               <SafeAreaView style={styles.styleForModalScreen}>
                <View style={styles.modalScreen}>
                <View style={styles.firstModalPart}>
                {renderProgressBar()}
                </View>

                <View style={styles.secondModalPart}>
                <Text style={styles.textResult}> You got {points} / {arrayQuiz.length} correct answers. </Text>
                <Text style={styles.textResult}> Please retry if you want! </Text>
                <Button onPress={handleRetry} style={styles.retryButton}> Retry Quiz </Button>
                </View>
                </View>
                </SafeAreaView>
            </Modal>
        )
    }

    //Handle to display single option

    const handleSingleOption : ListRenderItem<QuizDeclare["mappedOptions"]> = ({item, index}) => {

        const handlePress = (title : string | undefined) => {
            
            if (title === correctAnswer) {
                setDisable(true);
                setPoints((point) => point + 1);
                setIsCorrect(true);
                setTitle(title);
            } else {
                setDisable(true);
                setIsCorrect(false);
                setCorrectOption(correctAnswer);
                setTitle(title);
            }
            setNumberOfAnswers((number) => number + 1);
        }
         

        return <SingleOption title={title} index={index} optionTitle={item.optionTitle} optionText={item.optionText} handlePress={handlePress} handleDisable={setDisable} isDisable={disable} correctAnswer={correctAnswer} handleChangePoints={setPoints} handleAddCorrectOption={setCorrectOption} correctOption={correctOption} isCorrect={isCorrect} handleIsCorrect={setIsCorrect}/>
    }

    

    //Handle to next button
    const handleNext = () => {
        if (arrayQuiz != undefined) {
            if (currentQuestionIndex === arrayQuiz?.length - 1) {
                setCurrentQuestionIndex(arrayQuiz.length-1);
            } else {
                setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
            }
        }

        setDisable(false);
        setCorrectOption("");
        setIsCorrect(undefined);
        setTitle("");
    
        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    //Handle submit to get results

    const handleSubmit = () => {

        if (arrayQuiz != null || arrayQuiz != undefined) {
            if (numberOfAnswers < arrayQuiz?.length) {
                Alert.alert("Cannot submit to get results", "You have to answer the last question to submit this quiz!");
                return;
            } else {
                setModalOpen(true);
                Animated.timing(progress, {
                    toValue: currentQuestionIndex + 1,
                    duration: 1000,
                    useNativeDriver: false
                }).start();
            }
        }
        

    };

    
  return (
    <View style={styles.backgroundColorView}>
    <ImageBackground style={styles.screen} source={require("../assets/background.jpg")} resizeMode="cover" imageStyle={styles.imageStyle}> 
    <SafeAreaView style={styles.screen}>

    {renderProgressBar()}
    

    <View style={styles.mainContentContainer}>
        <View style={styles.questionBoxContainer}> 
            <Text style={styles.questionText}> Quiz {currentQuestionIndex + 1} : {parseQuestion}</Text>
        </View>

        <View style={styles.optionsBoxContainer}>
            <FlatList data={arrayOfMappedOptions} renderItem={handleSingleOption} keyExtractor={(item : any, index : any) => {
                return index + 1;
            }}/>
        </View>

        <View style={styles.buttonsContainer}>

            {(currentQuestionIndex < arrayQuiz.length-1 && disable)  && (<Button onPress={handleNext} style={styles.buttonColor}> Next </Button>)}
            {currentQuestionIndex === arrayQuiz.length - 1 && (<Button onPress={handleSubmit} style={styles.buttonColor}> Submit </Button>)}
        </View>

        
    </View>
    </SafeAreaView>
    </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
    progressBar: {
        height: 30,
        borderRadius: 2,
        borderWidth: 2,
        backgroundColor: ColorConstant.navyBlue,
        marginVertical: 10,
        marginHorizontal: 20
    },
    animatedView: {
        height: "100%",
        backgroundColor: ColorConstant.blueNeon
    },
    modalScreen: {
        flex: 1,
        backgroundColor: ColorConstant.blue,
    },
    retryButton: {
        backgroundColor: ColorConstant.pink
    },
    textResult: {
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 24,
        fontSize: 24,
        marginVertical: 24
    },
    optionsBoxContainer: {
        padding: 3,
        marginVertical: 10
    },
    questionBoxContainer: {
        marginBottom: 12
    },
    errorText: {
        color: ColorConstant.rederror,
        fontSize: 16,
        fontWeight: "bold"
    },
    errorPage: {
        alignItems: "center",
        justifyContent: "center"
    },
    backgroundColorView: {
        backgroundColor: ColorConstant.brown,
        flex: 1
    },
    mainContentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        flex: 1
    },
    screen: {
        flex: 1
    },
    styleForModalScreen: {
        flex: 1,
        backgroundColor: ColorConstant.blue
    },
    imageStyle: {
        opacity: 0.3,
    },
    questionText: {
        marginVertical: 20,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "left",
    
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonColor: {
        backgroundColor: ColorConstant.green
    },
    firstModalPart: {
        flex: 2,
        marginTop: 30
    },
    secondModalPart: {
        flex: 4
    }
});

