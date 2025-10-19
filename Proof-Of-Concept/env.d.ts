/// <reference types="vite/client" />
/// <reference types="vite/client" />

// Voeg dit blok toe:
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}