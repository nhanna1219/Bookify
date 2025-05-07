import SharedHeader from '@components/shared/SharedHeader';
import { Outlet } from 'react-router-dom';
import Footer from "@components/shared/Footer";

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
