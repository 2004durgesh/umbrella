import {
  View,
  Image,
  useColorScheme,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Linking,
  ScrollView,
  Share,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Appbar,
  Chip,
  Icon,
  IconButton,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';
import {Plugin} from '../../domain/entities/Plugin';
import {useBottomNavigationBarState} from '../../../../navigation/useBottomNavigationBarState';
import LazyImage from '../../../../core/shared/components/LazyImage';
import {usePluginStore} from '../state/usePluginStore';

const PluginInfoView = () => {
  const plugin =
    usePluginStore(state => state.viewInfoPlugin) || ({} as Plugin);

  const colorScheme = useColorScheme();
  const theme = useTheme();

  const navigation = useNavigation();
  const {setVisible} = useBottomNavigationBarState();

  useEffect(() => {
    const backAction = () => {
      setVisible(true);
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
  }, []);

  useEffect(() => {
    setVisible(false);
  }, []);

  const [showPlaceholder, setShowPlaceholder] = React.useState(false);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        style={{
          ...styles.scrollView,
          backgroundColor: theme.colors.background,
        }}>
        <View style={styles.header}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                setVisible(true);
                navigation.goBack();
              }}
            />
            <Text variant="titleLarge">{plugin.name}</Text>
          </View>
          <View style={{flexDirection: 'row', gap: 8}}>
            <IconButton
              icon="earth"
              onPress={() => {
                if (plugin.homePageUrl === undefined) return;
                {
                  if (plugin.homePageUrl === undefined) return;
                  Linking.openURL(plugin.homePageUrl);
                }
              }}
            />
            <IconButton
              icon="share"
              onPress={() => {
                if (plugin.homePageUrl === undefined) return;
                Share.share(
                  {
                    title: plugin.name,
                    url: plugin.homePageUrl,
                    message: plugin.homePageUrl,
                  },
                  {
                    dialogTitle: plugin.name,
                    subject: plugin.name,
                    tintColor: 'black',
                  },
                );
              }}
            />
          </View>
        </View>
        {plugin.bannerImageUrl !== undefined ? (
          <>
            <ImageBackground
              resizeMode="contain"
              source={
                showPlaceholder
                  ? require('../../../../../assets/images/placeholders/wide.jpg')
                  : {uri: plugin.bannerImageUrl}
              }
              onError={() => setShowPlaceholder(true)}
              style={styles.banner}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
                style={{flex: 1}}
              />
            </ImageBackground>
          </>
        ) : (
          <View style={styles.bannerPlaceholderContainer}>
            <Icon source="power-plug" size={50} />
          </View>
        )}
        <View style={styles.pluginInfoView}>
          <View style={styles.pluginInfoContainer}>
            {plugin.iconUrl !== undefined ? (
              <LazyImage
                src={plugin.iconUrl}
                placeholderSource="circle"
                style={{width: 100, height: 100, borderRadius: 100}}
              />
            ) : (
              <View style={styles.authorAvatarIcon}>
                <Icon source="account" size={50} />
              </View>
            )}
            <View style={styles.pluginNameAndDescription}>
              <Text variant="headlineMedium" style={{fontWeight: 'bold'}}>
                {plugin.name}
              </Text>
              <Text variant="bodyLarge">{plugin.author}</Text>
              <Text variant="bodyMedium">{plugin.description}</Text>
            </View>
          </View>
          <View style={styles.pluginMetaDataContainer}>
            <Chip style={styles.chip}>Version: {plugin.version}</Chip>
            {plugin.homePageUrl !== undefined ? (
              <Chip
                closeIcon={'open-in-new'}
                style={styles.chip}
                onClose={() => {}}
                onPress={() => {
                  if (plugin.homePageUrl === undefined) return;
                  Linking.openURL(plugin.homePageUrl);
                }}>
                Home Page
              </Chip>
            ) : null}
            <Chip
              closeIcon={'open-in-new'}
              style={styles.chip}
              onClose={() => {}}
              onPress={() => {
                if (plugin.manifestUrl === undefined) return;
                Linking.openURL(plugin.manifestUrl);
              }}>
              Manifest
            </Chip>
            <Chip
              closeIcon={'open-in-new'}
              style={styles.chip}
              onClose={() => {}}
              onPress={() => Linking.openURL(plugin.pluginUrl)}>
              Plugin
            </Chip>
          </View>
          <List.Section style={styles.pluginDetailsContainer}>
            <List.Item
              title="Changelog"
              description={plugin.changelog}
              onPress={() => {}}
            />
            <List.Item
              title="Readme"
              description={plugin.readme}
              onPress={() => {}}
            />
            {plugin.license && (
              <List.Item
                title="License"
                description={plugin.license}
                onPress={() => {}}
              />
            )}
            <List.Item
              title="Manifest File Location"
              description={plugin.manifestPath}
              onPress={() => {
                FileViewer.open(plugin.manifestPath!);
              }}
              right={props => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon {...props} source="folder" size={20} />
                </View>
              )}
            />
            <List.Item
              title="Plugin File Location"
              description={plugin.pluginPath}
              onPress={() => {
                FileViewer.open(plugin.pluginPath!);
              }}
              right={props => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon {...props} source="folder" size={20} />
                </View>
              )}
            />
          </List.Section>
        </View>
      </ScrollView>
    </View>
  );
};

export default PluginInfoView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pluginInfoView: {
    marginTop: -50,
    width: '100%',
  },
  banner: {
    width: '100%',
    height: 200,
  },
  bannerPlaceholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'gray',
  },
  pluginInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
    flex: 1,
  },
  authorAvatarIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
  },
  pluginNameAndDescription: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
    marginRight: 8,
  },
  pluginMetaDataContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 16,
  },
  chip: {
    height: 32,
    width: Dimensions.get('window').width / 2 - 36,
  },
  pluginDetailsContainer: {
    flex: 1,
    width: '100%',
  },
});
