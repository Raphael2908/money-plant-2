import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSQLiteContext } from 'expo-sqlite';
import { styles } from '../public/style';
import AddIcon from '../assets/icons/add-icon/add-icon';
import HomeCard from '../components/home-card';
import setup from '../database/setup'
import formatter from '../helpers/money-converter'
import SubscriptionController from '../database/subscription-controller';
import BudgetController from '../database/budget-controller';

export default function Index() {
  // SQLite Intialisation
  const db = useSQLiteContext();
  const subscriptionController = new SubscriptionController(db)
  const budgetController = new BudgetController(db)

  // States
  const [isLoading, setIsLoading] = useState(true)
  const [budgets, setBudgets] = useState()
  const [subscriptions, setSubscriptions] = useState()
  const [subscriptionName, setSubscriptionName] = useState()
  const [subscriptionFormValidation, setSubscriptionFormValidation] = useState({name: ''})

  // Bottom Sheet Intialisation
  const bottomSheetRef = useRef(null)
  const subscriptionSheetRef = useRef(null)

  // Bottom Sheet management
  const handleSheetOpen = () => bottomSheetRef.current?.expand()
  const handleSubscriptionFormOpen = () => subscriptionSheetRef.current?.expand()
  const handleSubscriptionFormClose = () => subscriptionSheetRef.current?.close()


  // Bottom Sheet backdrop component
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

  // SQLite CRUD functions
  const handleAddSubscription = async () => {
    const result = await subscriptionController.addSubscription(subscriptionName)
    if(result.error != undefined){
      setSubscriptionFormValidation({...subscriptionFormValidation, name: result.error})
      return 
    }
    setSubscriptionFormValidation({name: ''})
    setSubscriptions(result)
    handleSubscriptionFormClose()
    setSubscriptionName("")
  }

  async function loadData(){
    await budgetController.getBudgets().then((result) => {
      setBudgets(result)
    })
    await subscriptionController.getSubscriptions().then((result) => {
      setSubscriptions(result)
    })
    setIsLoading(false) // Helps to load the data 
  }

  useEffect(() => {
    setup("development")
    loadData()
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
          <StatusBar barStyle={'light-content'} backgroundColor={styles.dark.backgroundColor}/>
          {/* Header */}
          <View name="Header" style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.dark.headerText}>Welcome, Raphael</Text>
            <Pressable onPress={handleSheetOpen}><AddIcon/></Pressable>
          </View>
          
          {budgets.map((budget, index) => (
            <HomeCard key={index} title={budget.name} chip={`Budget Amount: ${formatter(budget.budget_amt)}`}/>
          ))}
          
          {subscriptions.map((subscriptions, index) => (
            <HomeCard key={index} title={subscriptions.name} chip={"Monthly bill: $0"}/>
          ))}

          <BottomSheet ref={bottomSheetRef} enablePanDownToClose={true} index={-1} snapPoints={["25%"]}>
            <View style={{ alignItems: "center" ,justifyContent: "center", gap: 10}} >
              <Pressable style={styles.light.button}>
                <Text style={styles.light.buttonText}>Add New Budget</Text>
              </Pressable>
              <Pressable style={styles.light.button}>
                <Text style={styles.light.buttonText} onPress={handleSubscriptionFormOpen}>Add New Subscription</Text>
              </Pressable>
            </View>
          </BottomSheet>
          
          {/* Form Bottom Sheet */}

          <BottomSheet backgroundStyle={{backgroundColor: styles.dark.backgroundColor}} backdropComponent={renderBackdrop} ref={subscriptionSheetRef} enablePanDownToClose={true} index={-1} snapPoints={["75%"]}>
            {/* Form Container */}
            <View style={{paddingVertical: 25, paddingHorizontal: 18, gap: 10}}>
              {/* Header */}
              <View name="Header">
                <Text style={styles.dark.headerText}>Add Subscriptions</Text>
              </View>
              {/* Form */}
              <View style={{justifyContent: "space-between", alignItems: "center", height:"90%"}}>
                {/* Name Input */}
                <View style={{width:"100%", gap:10}}>
                  {subscriptionFormValidation.name ? <Text style={{color: "crimson", }}>{subscriptionFormValidation.name}</Text>: null}
                  <TextInput value={subscriptionName} onChangeText={setSubscriptionName} style={{width:"100%", height: 43, borderWidth: 1, borderStyle:"solid",borderRadius: 5, paddingHorizontal: 10, borderColor: "white", color: "white"}} placeholderTextColor={"white"} placeholder='Name'/>
                </View>
                <Pressable style={styles.dark.button} onPress={handleAddSubscription}>
                  <Text style={styles.dark.buttonText}>Add New Subscription</Text>
                </Pressable>
              </View>
            </View>
          </BottomSheet>
          
      </GestureHandlerRootView>
  )

}