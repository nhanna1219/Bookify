import HomeHeader from '@components/shared/HomeHeader';
import { Outlet } from 'react-router-dom';
import Footer from "@components/shared/Footer";

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
