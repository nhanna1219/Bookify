import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeLayout from '@layouts/HomeLayout';
import DefaultLayout from '@layouts/DefaultLayout';
import PublicOnlyRoute from '@components/routing/PublicOnlyRoute.jsx';
import PrivateRoute from '@components/routing/PrivateRoute.jsx';
import ScrollToTop from '@components/shared/ScrollToTop';
import LoadingScreen from '@components/shared/LoadingScreen';

import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import ShopPage from '@pages/ShopPage';
import ResendVerificationPage from '@pages/ResendVerificationPage';
import ForgotPasswordPage from '@pages/ForgotPasswordPage';
import ResetPasswordPage from '@pages/ResetPasswordPage';
import AccountPage from '@pages/AccountPage';
import OrdersPage from '@pages/OrdersPage';
import ChangePasswordPage from '@pages/ChangePasswordPage';

import { lazy, Suspense } from 'react';
import ScrollToTopButton from "@components/shared/ScrollToTopButton.jsx";


const HomePage = lazy(() => import('@pages/HomePage/HomePage.jsx'));

export default function AppRoutes() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}
