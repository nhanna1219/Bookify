import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '@services/authService';
import { showPromise } from '@utils/toast';

export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const submit = async (data) => {
        setLoading(true);

        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        const res = await showPromise(
            resetPassword({
                token,
                newPassword: data.newPassword,
            }),
            {
                loading: 'Resetting password...',
                success: 'Password has been reset. Redirecting to login…',
                error: 'Failed to reset password.',
            }
        );

        if (res) {
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }

        setLoading(false);
    };

    return { loading, submit };
};
