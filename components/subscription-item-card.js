import { Text, View } from 'react-native';
import ArrowIcon from '../assets/icons/arrow-icon/arrow';
import transparentHexToRgbA from '../helpers/hex-to-rgba';

export default function SubscriptionItemCard({title, chip, headerChip, color}) {

    const transparentColorRgba = transparentHexToRgbA(`#${color}`)
    
    return (
      <>
       {/* Home Card */}
       <View style={{width:"100%", paddingHorizontal: 13, paddingVertical:17, backgroundColor: "#373737", borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <View style={{gap: 10}}>
            {/* Header */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 18, color:"white"}}>{title}</Text>
                <View style={{paddingHorizontal: 10, paddingVertical: 6.25, borderRadius: 5, backgroundColor: transparentColorRgba, alignSelf: "flex-start"}}>
                  <Text style={{color:`#${color}`, flexShrink: 1}}>{headerChip}</Text>
                </View>    
          </View>
          {/* Chip */}
          <View style={{paddingHorizontal: 10, paddingVertical: 6.25, borderRadius: 5, backgroundColor: transparentColorRgba, alignSelf: "flex-start"}}>
              <Text style={{color: `#${color}`, flexShrink: 1, fontSize: 22, fontWeight: 'bold'}}>{chip}</Text>
          </View>
        </View>
       <ArrowIcon/>
     </View>
     </>
  )
}