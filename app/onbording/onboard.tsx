import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WiseNKapScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#1D3D47' }}
      headerImage={
        <View style={styles.headerContainer}>
          <ThemedText style={styles.logo}>WN WiseNKap</ThemedText>
        </View>
      }>
      
      {/* Illustration Container */}
     {/* Illustration Image */}
<ThemedView style={styles.illustrationContainer}>
  <Image
    source={require('@/assets/images/imageonboard.png')}
    style={styles.imageonboard}
    resizeMode="contain"
  />
</ThemedView>


      {/* Title */}
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Simple Money Management
        </ThemedText>
        
        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>
          Congre quotidently your expenses to help metter manage your argent.
        </ThemedText>
      </ThemedView>

      {/* Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={() => router.push('/onbording/board')}
        >
          <LinearGradient
            colors={['#4169E1', '#1E90FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <ThemedText style={styles.buttonText}>LET'S GO</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  imageonboard: {
  width: '100%',
  height: 220,
},

  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 300,
  },
  moneyContainer: {
    position: 'relative',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  piggyLeft: {
    width: 70,
    height: 90,
    backgroundColor: '#4169E1',
    borderRadius: 35,
    zIndex: 1,
  },
  piggyRight: {
    width: 70,
    height: 90,
    backgroundColor: '#2ECC71',
    borderRadius: 35,
    marginLeft: -25,
    zIndex: 2,
  },
  phone: {
    position: 'absolute',
    bottom: -30,
    width: 55,
    height: 95,
    backgroundColor: '#34495E',
    borderRadius: 12,
    zIndex: 3,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
  },
  // Éléments décoratifs
  coin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    opacity: 0.8,
  },
  coin1: {
    top: 30,
    left: 20,
  },
  coin2: {
    bottom: 50,
    right: 30,
  },
  bill: {
    position: 'absolute',
    width: 45,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
    opacity: 0.8,
  },
  bill1: {
    top: 20,
    right: 20,
    transform: [{ rotate: '15deg' }],
  },
  bill2: {
    bottom: 70,
    left: 30,
    transform: [{ rotate: '-10deg' }],
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4169E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});