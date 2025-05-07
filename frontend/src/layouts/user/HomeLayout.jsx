import HomeHeader from '@components/user/shared/HomeHeader';
import { Outlet } from 'react-router-dom';
import Footer from "@components/user/shared/Footer";

export default function HomeLayout() {
    return (
        <>
            <HomeHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
