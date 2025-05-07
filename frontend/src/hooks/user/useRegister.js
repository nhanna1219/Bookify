import { useState } from 'react';
import { registerUser } from '@services/authService';
import { showPromise } from '@utils/toast';

export function useRegister() {
    const [loading, setLoading] = useState(false);

    const submit = async (data) => {
        setLoading(true);

        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
            phone: data.phoneNumber,
            streetAddress: data.streetAddress || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            country: data.country || '',
        };

        await showPromise(
            registerUser(payload),
            {
                loading: 'Creating account...',
                success: 'Account created! Please check your email.',
                error: 'Registration failed!'
            }
        );

        setLoading(false);
    };

    return { loading, submit };
}
