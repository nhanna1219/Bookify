import { useState } from 'react';
import { sendPasswordResetLink } from '@services/authService';
import { showPromise } from '@utils/toast';

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const submit = async (data) => {
        setLoading(true);
        await showPromise(
            sendPasswordResetLink(data.email),
            {
                loading: 'Sending password reset link...',
                success: 'Password reset link has been sent. Please check your email.',
                error: 'Failed to send reset link.'
            }
        );
        setLoading(false);
    };

    return { loading, submit };
};
