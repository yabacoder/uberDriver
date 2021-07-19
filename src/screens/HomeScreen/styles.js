import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  bottomContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  bottomText: {
    fontSize: 22,
    color: '#4a4a4a',
  },
  roundButton: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
  },
  goButton: {
    position: 'absolute',
    backgroundColor: '#1495ff',
    padding: 10,
    borderRadius: 50,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 110,
    left: Dimensions.get('window').width / 2 - 37,
  },
  goText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  balanceButton: {
    position: 'absolute',
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 50,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    left: Dimensions.get('window').width / 2 - 50,
  },
  balanceText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
