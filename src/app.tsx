import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/app/router';

export const App = () => {
  return <RouterProvider router={router} />;
};
