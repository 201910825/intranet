// /src/main.tsx
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
const queryClient = new QueryClient();
 
const router = createRouter({
  routeTree,
  defaultPreload: 'intent' as const,
  defaultPreloadStaleTime: 0,
});
 
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
 


 
const rootElement = document.getElementById('root')!;
 
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
