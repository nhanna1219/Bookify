import { Routes, Route } from 'react-router-dom';
import HomeLayout from '@u_layouts/HomeLayout.jsx';
import DefaultLayout from '@u_layouts/DefaultLayout.jsx';
import PublicOnlyRoute from '@u_components/routing/PublicOnlyRoute.jsx';
import PrivateRoute from '@u_components/routing/PrivateRoute.jsx';
import ScrollToTop from '@u_components/shared/ScrollToTop';
import LoadingScreen from '@u_components/shared/LoadingScreen';

import LoginPage from '@u_pages/LoginPage';
import RegisterPage from '@u_pages/RegisterPage.jsx';
import ShopPage from '@u_pages/ShopPage';
import ResendVerificationPage from '@u_pages/ResendVerificationPage';
import ForgotPasswordPage from '@u_pages/ForgotPasswordPage';
import ResetPasswordPage from '@u_pages/ResetPasswordPage.jsx';
import AccountPage from '@u_pages/AccountPage.jsx';
import OrdersPage from '@u_pages/OrdersPage.jsx';
import ChangePasswordPage from '@u_pages/ChangePasswordPage.jsx';

import { lazy, Suspense } from 'react';
import ScrollToTopButton from "@u_components/shared/ScrollToTopButton.jsx";

const HomePage = lazy(() => import('@u_pages/HomePage/HomePage.jsx'));

export default function UserRoutes() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route element={<HomeLayout />}>
                        <Route path="/" element={<HomePage />} />
                    </Route>
                    <Route element={<PublicOnlyRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>
                    <Route element={<DefaultLayout />}>
                        <Route path="/resend-verification" element={<ResendVerificationPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/change-password" element={<ChangePasswordPage />} />
                        </Route>
                    </Route>
                </Routes>
                <ScrollToTopButton />
            </Suspense>
        </>
    );
}
