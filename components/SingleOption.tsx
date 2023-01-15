
import React, { Dispatch, SetStateAction } from 'react';
import {View, Text, StyleSheet, Pressable} from "react-native";
import { ColorConstant } from '../constants/colors';
import {useState} from "react";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    optionTitle: string | undefined,
    optionText: string | undefined,
    isDisable: boolean,
    handleDisable: React.Dispatch<React.SetStateAction<boolean>>,
    handleChangePoints: React.Dispatch<React.SetStateAction<number>>,
    correctAnswer: string | undefined,
    handleAddCorrectOption: React.Dispatch<React.SetStateAction<string | undefined>>,
    correctOption: string | undefined,
    isCorrect: boolean | undefined,
    handlePress: (optionTitle : string | undefined) => void,
    index: number,
    handleIsCorrect: React.Dispatch<React.SetStateAction<boolean | undefined>>,
    title: string | undefined
}

function SingleOption(props: Props) {
  
  const handleSubmit = () => {
      props.handlePress(props.optionTitle);
  }

  return (
    <Pressable onPress={handleSubmit} disabled={props.isDisable}>
    <View style={[styles.singleOptionContainer, (props.title === props.optionTitle && props.isCorrect) && styles.isCorrectBorderColor,(props.title === props.optionTitle && !props.isCorrect) && styles.notCorrectBorderColor, (props.correctOption === props.optionTitle) && styles.isCorrectBorderColor]}>
      <View style={styles.singleOptionLeftSide}>
      <View style={styles.titleCover}>
      <Text style={styles.textTitle}> {props.index + 1} </Text>
      </View>
      </View>

      <View style={styles.singleOptionMiddleSide}>
      <Text style={styles.textAnswer}> {props.optionText} </Text>
      </View>

      <View style={styles.singleOptionRightSide}>
        
        {(props.title === props.optionTitle && props.isCorrect) && 
        <Ionicons name='checkmark-outline' size={30} color={ColorConstant.boldGreen}/>
        }

      {(props.title === props.optionTitle && !props.isCorrect) && 
        <Ionicons name='close-circle-outline' size={30} color={ColorConstant.boldRed}/>
      }

      {(props.correctOption === props.optionTitle) && 
        <Ionicons name='checkmark-outline' size={30} color={ColorConstant.boldGreen}/>
      }
      </View>

      
    </View>
    </Pressable>
  )
};

const styles = StyleSheet.create({
    singleOptionContainer: {
        borderWidth: 2,
        marginVertical: 10,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 18,
        flexDirection: "row",
        flex: 8,
        backgroundColor: ColorConstant.blue
    },
    titleCover: {
       width: 30,
       height: 30,
       borderRadius: 15,
       backgroundColor: "white",
       borderWidth: 1.5,
       alignItems: "center",
       justifyContent: "center"
    },
    normalBorderColor: {
      borderColor: "black"
    },
    singleOptionLeftSide: {
      flex: 2,
    },
    singleOptionMiddleSide: {
      flex: 3,
      justifyContent: "center",
    },
    singleOptionRightSide: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center"
    },
    textTitle: {
        fontWeight: "bold",
  
    },
    textAnswer: {
        fontWeight: "bold",
        textAlign: "left",
    },
    isCorrectBorderColor: {
      borderColor: ColorConstant.boldGreen
    },
    notCorrectBorderColor: {
      borderColor: ColorConstant.boldRed
    }
});

export default SingleOption