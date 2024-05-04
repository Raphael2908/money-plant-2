import { Text, View } from 'react-native';
import ArrowIcon from '../assets/icons/arrow-icon/arrow';

export default function HomeCard({title, chip}) {
  return (
      <>
       {/* Home Card */}
       <View style={{paddingHorizontal: 13, paddingVertical:17, backgroundColor: "#373737", borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
       <View style={{gap: 10}}>
         <Text style={{fontWeight: 'bold', fontSize: 13, color:"white"}}>{title}</Text>
         {/* Chip */}
         <View style={{paddingHorizontal: 10, paddingVertical: 6.25, borderRadius: 5, backgroundColor:"#364954", alignSelf: "flex-start"}}>
             <Text style={{color:"#529CCA", flexShrink: 1}}>{chip}</Text>
         </View>
       </View>
       <ArrowIcon/>
     </View>
     </>
  )
}