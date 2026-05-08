import { useThemeStore } from './store';
import { themes, type Theme } from './themes';

export function useTheme(): Theme {
  const id = useThemeStore((s) => s.styleId);
  return themes[id] ?? themes.clay;
}
