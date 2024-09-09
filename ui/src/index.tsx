import { createContext, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Home from './pages/Home';
import TestPage from './pages/TestPage';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import { UserWrapper } from './components/UserWrapper';

// Wrap authed pages in UserWrapper
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <UserWrapper>
                <Home />
            </UserWrapper>
        )
    },
    {
        path: '/test',
        element: <TestPage />
    },
    {
        path: '/signup',
        element: <SignUp />
    },
    {
        path: '/login',
        element: <LogIn />
    }
]);

const queryClient = new QueryClient();
// const UserContext = createContext(null);
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const UserContext =

    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>
    );
