import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { styles } from '../public/style';
import AddIcon from '../assets/icons/add-icon/add-icon';
import HomeCard from '../components/home-card';
import db from '../database/db';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import setupDatabase from '../database/setup';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import getBudget from '../database/budget/get-budgets';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState()

  const bottomSheetRef = useRef(null)
  const handleSheetOpen = () => bottomSheetRef.current?.expand()

  useEffect(() => {
    // Call Database
    setupDatabase()
    // getBudget()
    setIsLoading(false)
  },[])
  
  if(isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }
 
  return (
      <GestureHandlerRootView style={styles.dark.container}>

          {/* Header */}
          <View name="Header" style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.dark.headerText}>Welcome, Raphael</Text>
            <Pressable onPress={handleSheetOpen}><AddIcon/></Pressable>
          </View>
          
          <HomeCard title="Budget" chip="Today’s spending: $72.90"/>
          <HomeCard title="Subscription" chip="Monthly bill: $215"/>
          
          <BottomSheet ref={bottomSheetRef} enablePanDownToClose={true} index={-1} snapPoints={["25%"]}>
            <View style={{ alignItems: "center" ,justifyContent: "center", gap: 10}} >
              <Pressable style={styles.light.button}>
                <Text style={styles.light.buttonText}>Add New Budget</Text>
              </Pressable>
              <Pressable style={styles.light.button}>
                <Text style={styles.light.buttonText}>Add New Subscription</Text>
              </Pressable>
            </View>
          </BottomSheet>
          
      </GestureHandlerRootView>
  )

}