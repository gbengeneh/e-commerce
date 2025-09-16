import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Ecommerce = () => {
  return (
    <View style={{flex:1}}>
     <ScrollView
     horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
     >

     </ScrollView>
    </View>
  )
}

export default Ecommerce

const styles = StyleSheet.create({
   filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
})