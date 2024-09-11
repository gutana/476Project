import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import { UserWrapper } from './components/UserWrapper';
import { DefaultLayout } from './components/DefaultLayout';
import { BasicLayout } from './components/BasicLayout';

// Wrap authed pages in UserWrapper
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <Home />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/signup',
        element: (
            <BasicLayout>
                <SignUp />
            </BasicLayout>
        )
    },
    {
        path: '/login',
        element: (
            <BasicLayout>
                <LogIn />
            </BasicLayout>
        )
    }
]);

const queryClient = new QueryClient();
// const UserContext = createContext(null);
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);
