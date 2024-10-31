import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import PostNews from './pages/PostNews';
import { UserWrapper } from './components/UserWrapper';
import { DefaultLayout } from './components/DefaultLayout';
import { BasicLayout } from './components/BasicLayout';
import Edit from './pages/Edit';
import Approve from './pages/Approve';
import AddSchool from './pages/Schools';

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
        path: '/postnews',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <PostNews />
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
    },
    {
        path: '/edit',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <Edit />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/requestedAccounts',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <Approve />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/addSchool',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <AddSchool />
                </DefaultLayout>
            </UserWrapper>
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
