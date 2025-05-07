import { useState } from 'react';
import { resendVerificationEmail } from '@services/authService';
import { showPromise } from '@utils/toast';

export const useResendVerification = () => {
    const [loading, setLoading] = useState(false);

    const submit = async (data) => {
        setLoading(true);

        await showPromise(
            resendVerificationEmail(data.email),
            {
                loading: 'Resending verification email...',
                success: 'Verification email has been resent. Please check your inbox.',
                error: 'Failed to resend verification email.',
            }
        );

        setLoading(false);
    };

    return { loading, submit };
};
