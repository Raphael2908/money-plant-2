import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSQLiteContext } from 'expo-sqlite';
import { styles } from '../public/style';
import AddIcon from '../assets/icons/add-icon/add-icon';
import HomeCard from '../components/home-card';
import setup from '../database/setup'
import formatter from '../helpers/money-converter'

export default function Page() {
  const db = useSQLiteContext();
  const [isLoading, setIsLoading] = useState(true)
  const [budget, setBudget] = useState()
  const bottomSheetRef = useRef(null)
  const handleSheetOpen = () => bottomSheetRef.current?.expand()
  
  useEffect(() => {
    async function getBudget() {
      const result = await db.getAllAsync('SELECT * FROM Budgets');
      setBudget(result);
      setIsLoading(false) // Helps to load the data correctly
    }
    setup("development")
    getBudget()
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
          
          {budget.map((budget, index) => (
            <HomeCard index={index} title={budget.name} chip={`Budget Amount: ${formatter(budget.budget_amt)}`}/>
          ))}
          
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