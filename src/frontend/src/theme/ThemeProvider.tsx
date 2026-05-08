import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from './store';
import { themes, themeToCssVars } from './themes';

/**
 * Inyecta las CSS vars del estilo activo en `<html>` y sincroniza
 * `data-style` para que los overrides CSS por material entren en juego.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const styleId = useThemeStore((s) => s.styleId);

  useEffect(() => {
    const theme = themes[styleId] ?? themes.clay;
    const vars = themeToCssVars(theme);
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) {
      root.style.setProperty(k, v);
    }
    root.dataset.style = theme.id;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.tokens.page);
  }, [styleId]);

  return <>{children}</>;
}
