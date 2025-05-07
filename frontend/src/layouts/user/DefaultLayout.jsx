import SharedHeader from '@components/user/shared/SharedHeader';
import { Outlet } from 'react-router-dom';
import Footer from "@components/user/shared/Footer";

export default function DefaultLayout() {
    return (
        <>
            <SharedHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
