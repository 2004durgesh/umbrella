import {Plugin} from '../../domain/entities/Plugin';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persist, createJSONStorage} from 'zustand/middleware';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';
import {PluginRepositoryImpl} from '../../data/repository/PluginRepositoryImpl';

const deletePlugin = new DeletePluginUsecase(new PluginRepositoryImpl());

// Plugin store
// This store is used to store the plugins.
// Will be used by the plugin viewmodels.
// Also has CRUD methods for plugins.
// TODO: implement usecases
// TODO: persist plugins
interface PluginStoreState {
  plugins: Plugin[];
  setPlugins: (plugins: Plugin[]) => void;
  permissionsGranted: boolean;
  onPermissionsGranted: () => void;
  onPermissionsDenied: () => void;
  registerPlugin: (plugin: Plugin) => void;
  pluginToDelete: Plugin | null;
  setPluginToDelete: (plugin: Plugin | null) => void;
  deletePlugin: (plugin: Plugin) => Promise<void>;
  getPlugin: (path: string) => Plugin | undefined;
  getPlugins: () => Plugin[];
  activePlugin: Plugin | null;
  setActivePlugin: (plugin: Plugin | null) => void;
  viewInfoPlugin: Plugin | null;
  setViewInfoPlugin: (plugin: Plugin) => void;
}

export const usePluginStore = create(
  persist<PluginStoreState>(
    (set, get) => ({
      permissionsGranted: false,
      onPermissionsGranted: () => set({permissionsGranted: true}),
      onPermissionsDenied: () => set({permissionsGranted: false}),
      plugins: [],
      setPlugins: plugins => set({plugins}),
      registerPlugin: plugin => {
        set(state => ({
          plugins: [...state.plugins, plugin],
        }));
      },
      pluginToDelete: null,
      setPluginToDelete: plugin => set({pluginToDelete: plugin}),
      deletePlugin: async (plugin: Plugin) => {
        if (!plugin) {
          throw new Error('Plugin not found');
        }
        await deletePlugin.execute(plugin);
        get().setPlugins(get().plugins.filter(p => p !== plugin));
      },
      getPlugin: path =>
        get().plugins.find(plugin => plugin.pluginPath === path),
      getPlugins: () => get().plugins,
      activePlugin: null,
      setActivePlugin: plugin => set({activePlugin: plugin}),
      viewInfoPlugin: null,
      setViewInfoPlugin: (plugin: Plugin) => set({viewInfoPlugin: plugin}),
    }),
    {
      name: 'plugins',
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
    },
  ),
);
