import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import AddNewsPage from './pages/AddNews';
import ViewPostings from './pages/ViewAvailablePostings'
import ViewMyPostingsPage from './pages/ViewMyPostings'
import { UserWrapper } from './components/UserWrapper';
import { DefaultLayout } from './components/DefaultLayout';
import { BasicLayout } from './components/BasicLayout';
import EditProfilePage from './pages/EditProfile';
import ApproveAccountPage from './pages/ApproveAccount';
import AddSchoolPage from './pages/AddSchool';
import AddPostPage from './pages/AddPost';
import { ThemeProvider } from './components/ThemeProvider';

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
                    <AddNewsPage />
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
                    <EditProfilePage />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/requestedAccounts',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <ApproveAccountPage />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/addSchool',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <AddSchoolPage />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/addPost',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <AddPostPage />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/viewPostings',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <ViewPostings />
                </DefaultLayout>
            </UserWrapper>
        )
    },
    {
        path: '/viewMyPostings',
        element: (
            <UserWrapper>
                <DefaultLayout>
                    <ViewMyPostingsPage />
                </DefaultLayout>
            </UserWrapper>
        )
    }
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);
