import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { styles } from '../public/style';
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import AddIcon from '../assets/icons/add-icon/add-icon';
import HomeCard from '../components/home-card';

export default function Page() {
  return (
      <View style={styles.dark.container}>
        {/* Header */}
        <View name="Header" style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center"}}>
          <Text style={styles.dark.headerText}>Welcome, Raphael</Text>
          <AddIcon/>
        </View>
        <HomeCard title="Budget" chip="Today’s spending: $72.90"/>
        <HomeCard title="Subscription" chip="Monthly bill: $215"/>
      </View>
  )

}