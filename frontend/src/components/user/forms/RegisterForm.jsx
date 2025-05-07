import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@utils/validate';
import { useRegister } from '@hooks/useRegister';
import FormInput from '../shared/FormInput';
import { Link } from 'react-router-dom';
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function RegisterForm() {
    const { loading, submit } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                    label="First Name"
                    required
                    placeholder="Enter First Name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                />
                <FormInput
                    label="Last Name"
                    required
                    placeholder="Enter Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                />
            </div>

            <FormInput
                label="Email"
                required
                placeholder="Enter Email Address"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
            />

            <div className="w-full">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                </label>
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            {...field}
                            country={'vn'}
                            inputProps={{
                                name: 'phoneNumber',
                                required: true,
                                autoComplete: 'tel',
                                id: 'phoneNumber'
                            }}
                            inputClass={`w-full text-sm px-3 py-2 border rounded focus:outline-none 
                                focus:ring-1 focus:ring-black focus:border-black
                                ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                            inputStyle={{
                                width: '100%',
                                color: '#111827'
                            }}
                        />
                    )}
                />
                {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                    label="Street Address"
                    placeholder="Enter Street Address"
                    {...register('streetAddress')}
                    error={errors.streetAddress?.message}
                />
                <FormInput
                    label="City"
                    placeholder="Enter City"
                    {...register('city')}
                    error={errors.city?.message}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                    label="State / Province"
                    placeholder="Enter State or Province"
                    {...register('state')}
                    error={errors.state?.message}
                />
                <FormInput
                    label="Postal / Zip Code"
                    placeholder="Enter Postal Code"
                    {...register('postalCode')}
                    error={errors.postalCode?.message}
                />
            </div>

            <FormInput
                label="Country"
                placeholder="Enter Country"
                {...register('country')}
                error={errors.country?.message}
            />

            <FormInput
                label="Password"
                type="password"
                required
                placeholder="Enter Password"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
            />

            <FormInput
                label="Re-enter Password"
                type="password"
                required
                placeholder="Re-enter Password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
            />

            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="agreeToTerms"
                    {...register('agreeToTerms')}
                    className="mt-0.5 accent-black w-4 h-4"
                />
                <label htmlFor="agreeToTerms" className="text-xs text-gray-700 leading">
                    I confirm that I have read and agree to the&nbsp;
                    <a href="#" className="text-black underline hover:text-gray-700 transition">Terms of Service</a>
                    &nbsp;and&nbsp;
                    <a href="#" className="text-black underline hover:text-gray-700 transition">Privacy Policy</a>.
                </label>
            </div>
            {errors.agreeToTerms && (
                <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms.message}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-1/4 mx-auto block bg-black text-white text-sm font-semibold py-3 px-4 rounded-md mt-10
                    shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                    hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]
                    transition-all duration-200 ease-in-out
                    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Please wait…' : 'Sign Up'}
            </button>

            <GoogleLoginButton />

            <p className="text-center text-sm">
                Already have an account? <Link to="/login" className="text-black underline hover:text-gray-700 transition">Log in</Link>
            </p>
        </form>
    );
}
