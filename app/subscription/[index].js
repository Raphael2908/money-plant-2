import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View, FlatList, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import { styles } from '../../public/style';
import SubscriptionItemController from '../../database/subscription-item-controller';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import moneyConverter from '../../helpers/money-converter';
import SubscriptionItemCard from '../../components/subscription-item-card';
import AddIcon from '../../assets/icons/add-icon/add-icon';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ArrowSquareDown from '../../assets/icons/arrow-square-down/arrow-square-down';
import Check from '../../assets/icons/check/check';

export default function SubscriptionIndex() {
  // Props
  const { id, name} = useLocalSearchParams();

  // SQL initialisation
  const db = useSQLiteContext();
  const subscriptionItemController = new SubscriptionItemController(db)
  
  // States
  const [subscriptionItems, setSubscriptionItems] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [dateForDatePicker, setDateForDatePicker] = useState(new Date()) // This state only exists because the date picker value property requires a Date() object
  const [formValidation, setFormValidation] = useState({})
  const [subscriptionItemForm, setSubscriptionItemForm] = useState({
    name: "",
    price: 0, 
    color: "529CCA",
    start_date: new Date().toISOString().split('T')[0],
    reset_type: "daily",
    reset_interval: 0,
    id: id
  })


  // Helper
  async function handleAddSubscriptionItem(){
    const result = await subscriptionItemController.addSubscriptionItem(
      subscriptionItemForm.name,
      subscriptionItemForm.price,
      subscriptionItemForm.color,
      subscriptionItemForm.start_date,
      subscriptionItemForm.reset_type,
      subscriptionItemForm.reset_interval,
      subscriptionItemForm.id
    )
    if(result.error == true){
      console.log(result)
      setFormValidation(result)
      return 
    }
    setSubscriptionItems(result)
    handleSubscriptionItemFormClose()
  }


  // Initialisation 
  async function loadData(){
    await (await subscriptionItemController.getSubscriptionItems()).whereIdEquals(id).then((result) => {
      setSubscriptionItems(result)
    })
    setIsLoading(false) // Helps to load the data 
  }

  // Bottom Sheet Intialisation
  const subscriptionItemSheetRef = useRef(null)
  const resetTypePickerSheetRef = useRef(null)
  const datePickerBottomSheet = useRef(null)

  // Bottom Sheet management
  const handleSubscriptionItemFormOpen = () => subscriptionItemSheetRef.current?.expand()
  const handleSubscriptionItemFormClose = () => subscriptionItemSheetRef.current?.close()
  const handleResetTypePickerOpen = () => resetTypePickerSheetRef.current?.expand()
  const handleDatePickerOpen = () => datePickerBottomSheet.current?.expand()
  const handleDatePickerClose = () => datePickerBottomSheet.current?.close()

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

  useEffect(() => {
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
      {/* List */}
      <Stack.Screen options={{
        title: name, 
        headerStyle: {
          backgroundColor: "#272727",
        },
        headerTitleStyle: {
          color: "white"
        },
        headerBackTitle: "Home",
        headerRight: () => <Pressable onPress={handleSubscriptionItemFormOpen}><AddIcon/></Pressable>
      }}/>
      <FlatList
        style={{paddingVertical: 10}}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        data={subscriptionItems}
        renderItem={({item}) => <SubscriptionItemCard color={item.color} title={item.name} chip={moneyConverter(item.price)} headerChip={`Next payment on ${item.next_billing_date}`}/>}>
      </FlatList>
      
      

       {/* Form Bottom Sheet */}
       <BottomSheet onClose={() => {
        setSubscriptionItemForm({
        name: "",
        price: 0, 
        color: "529CCA",
        start_date: new Date().toISOString().split('T')[0],
        reset_type: "daily",
        reset_interval: 0,
        id: id})
       }} backgroundStyle={{backgroundColor: styles.dark.backgroundColor}} backdropComponent={renderBackdrop} ref={subscriptionItemSheetRef} enablePanDownToClose={true} index={-1} snapPoints={["90%"]}>
        {/* Form Container */}
        <ScrollView style={{paddingVertical: 25, paddingHorizontal: 18, gap: 10}}>
          {/* Header */}
          <View name="Header">
            <Text style={styles.dark.headerText}>Add details</Text>
          </View>

          {/* Form */}
          <View style={{justifyContent: "space-between", alignItems: "center", height:"90%"}}>
            <View style={{gap: 40, width: "100%"}}>
              {/* Name Input */}
              <View style={{width:"100%", gap:10}}>
                {formValidation.nameError ? <Text style={{color: "crimson", }}> {formValidation.nameError} </Text> : null}
                <TextInput value={subscriptionItemForm.name} onChangeText={(value) => setSubscriptionItemForm({...subscriptionItemForm, name: value})} style={{width:"100%", height: 43, borderWidth: 1, borderStyle:"solid",borderRadius: 5, paddingHorizontal: 10, borderColor: "white", color: "white"}} placeholderTextColor={"white"} placeholder='Name'/>
                {formValidation.priceError ? <Text style={{color: "crimson", }}> {formValidation.priceError} </Text> : null}
                <TextInput keyboardType='number-pad' value={subscriptionItemForm.price} onChangeText={(value) => setSubscriptionItemForm({...subscriptionItemForm, price: value})} style={{width:"100%", height: 43, borderWidth: 1, borderStyle:"solid",borderRadius: 5, paddingHorizontal: 10, borderColor: "white", color: "white"}} placeholderTextColor={"white"} placeholder='Price'/>
                <TextInput value={subscriptionItemForm.color} onChangeText={(value) => setSubscriptionItemForm({...subscriptionItemForm, color: value})} style={{width:"100%", height: 43, borderWidth: 1, borderStyle:"solid",borderRadius: 5, paddingHorizontal: 10, borderColor: "white", color: "white"}} placeholderTextColor={"white"} placeholder='Color'/>
              </View>

              {/* Billing cycle configuration */}
              <View style={{width:"100%", gap:10}}>
                {/* {subscriptionFormValidation.name ? <Text style={{color: "crimson", }}>{subscriptionFormValidation.name}</Text>: null} */}
                <Pressable onPress={handleResetTypePickerOpen} style={formStyle.formInput}  placeholderTextColor={"white"}>
                  <Text style={formStyle.formInputText}>Resets</Text>
                  <View style={{flexDirection: "row",gap: 2, alignItems: "center"}}>
                    {
                      subscriptionItemForm.reset_type == "daily" ? 
                      <Text style={{color: "white"}}>After an amount of days</Text> : 
                      <Text style={{color: "white"}}>On a specific day every month</Text>
                    }
                    <ArrowSquareDown/>
                  </View>
                </Pressable>
                {/* Dynamic form */}
                
                {subscriptionItemForm.reset_type == "daily" ? (
                  <View style={{gap: 10}}>
                    {formValidation.reset_intervalError ? <Text style={{color: "crimson", }}> Days cannot be empty </Text> : null}
                    <TextInput keyboardType='number-pad' value={subscriptionItemForm.reset_interval} onChangeText={(value) => setSubscriptionItemForm({...subscriptionItemForm, reset_interval: value})} style={formStyle.formInput} placeholderTextColor={"white"} placeholder='Days'/>
                    <Pressable onPress={handleDatePickerOpen} style={formStyle.formInput}  placeholderTextColor={"white"}>
                      <Text style={formStyle.formInputText}>From this day</Text>

                      <View style={{flexDirection: "row",gap: 2, alignItems: "center"}}>
                        <View style={{paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, backgroundColor:"#364954", alignSelf: "flex-start"}}>
                          <Text style={{color:"#529CCA", flexShrink: 1}}>{subscriptionItemForm.start_date}</Text>
                        </View>
                      </View>

                    </Pressable>
                  </View>
                ) : (
                  <View style={{gap: 10}}>
                    {formValidation.reset_intervalError ? <Text style={{color: "crimson", }}>Date cannot be 0</Text> : null}
                    <Pressable onPress={handleDatePickerOpen} style={formStyle.formInput}  placeholderTextColor={"white"}>
                      <Text style={formStyle.formInputText}>Date</Text>
                      <View style={{flexDirection: "row",gap: 2, alignItems: "center"}}>
                        <View style={{paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, backgroundColor:"#364954", alignSelf: "flex-start"}}>
                          <Text style={{color:"#529CCA", flexShrink: 1}}>Every {subscriptionItemForm.reset_interval}</Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                )
                }

              </View>
              <Pressable style={styles.dark.button} onPress={handleAddSubscriptionItem}>
                <Text style={styles.dark.buttonText}>Add New detail</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </BottomSheet>

      {/* Picker Bottom Sheet */}
      <BottomSheet backgroundStyle={{backgroundColor: styles.dark.backgroundColor}} backdropComponent={renderBackdrop} ref={resetTypePickerSheetRef} enablePanDownToClose={true} index={-1} snapPoints={["70%"]}> 
        <View style={{paddingVertical: 25, paddingHorizontal: 18, gap: 10}}>
          <Pressable onPress={() => setSubscriptionItemForm({...subscriptionItemForm, reset_type:"daily"})} style={formStyle.formInput}  placeholderTextColor={"white"}>
            <Text style={formStyle.formInputText}>Daily</Text>
            {subscriptionItemForm.reset_type == "daily" ? <Check/> : null }
          </Pressable>
          <Pressable onPress={() => setSubscriptionItemForm({...subscriptionItemForm, reset_type:"monthly"})} style={formStyle.formInput}  placeholderTextColor={"white"}>
            <Text style={formStyle.formInputText}>Monthly</Text>
            {subscriptionItemForm.reset_type == "monthly" ?  <Check/> : null }
          </Pressable>
        </View>
      </BottomSheet>

      {/* Date Bottom Sheet */}
       <BottomSheet backgroundStyle={{backgroundColor: styles.dark.backgroundColor}} backdropComponent={renderBackdrop} ref={datePickerBottomSheet} enablePanDownToClose={true} index={-1} snapPoints={["50%"]}> 
        <View style={{paddingVertical: 25, paddingHorizontal: 18, gap: 10}}>
          <RNDateTimePicker onChange={(event, date) => {
            if(subscriptionItemForm.reset_type == "monthly"){
              setSubscriptionItemForm({...subscriptionItemForm, reset_interval: date.getDate()})
            }
            else if (subscriptionItemForm.reset_type == "daily") {
              setSubscriptionItemForm({...subscriptionItemForm, start_date: date.toISOString().split('T')[0]})
            }
            setDateForDatePicker(date)
          }} textColor={"white"} value={dateForDatePicker} display="spinner" />
          <Pressable style={styles.dark.button} onPress={handleDatePickerClose}>
            <Text style={styles.dark.buttonText}>Set date</Text>
          </Pressable>
        </View>
      </BottomSheet>

    </GestureHandlerRootView>
  )
}

const formStyle = StyleSheet.create({
  formInput: {
    width:"100%", 
    height: 43, 
    borderWidth: 1, 
    borderStyle:"solid",
    borderRadius: 5, 
    paddingHorizontal: 10, 
    borderColor: "white", 
    color: "white",
    justifyContent: "space-between" ,
    alignItems: "center",
    flexDirection: "row"
  },
  formInputText: {
    color: "white"
  }
})