import {useContext, useEffect, useState, useRef, useMemo} from "react"
import {useForm, Controller} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {checkoutSchema} from "@utils/validate.js"
import {MapPin, Edit2} from "lucide-react"
import FormInput from "@u_components/shared/FormInput.jsx"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import OrderSummary from "@u_components/checkout/OrderSummary.jsx"
import {useNavigate} from "react-router-dom"
import CheckoutProgress from "@u_components/checkout/CheckoutProgress.jsx"
import {useAddressData} from "@u_hooks/useAddressData.js"
import {AuthContext} from "@contexts/AuthContext.jsx"
import {CheckoutContext} from "@contexts/CheckoutContext.jsx"

export default function CheckoutPage() {
    const {auth} = useContext(AuthContext)
    const {
        selectedItems,
        totals,
        shippingAddress,
        usingSaved,
        setShippingAddress,
        setUsingSaved,
        setOrderCompleted,
    } = useContext(CheckoutContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!selectedItems || selectedItems.length === 0) {
            navigate("/cart", {replace: true})
        }
    }, [selectedItems, navigate])

    const {itemsCount, subtotal, shipping, taxes, discount, total} = totals

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: {errors, isDirty},
    } = useForm({
        resolver: yupResolver(checkoutSchema),
        defaultValues: shippingAddress || {},
    })

    const selectedCountry = watch("country")
    const selectedState = watch("state")

    const [userAddress, setUserAddress] = useState(null)
    const prevCountryRef = useRef(null)
    const prevStateRef = useRef(null)

    useEffect(() => {
        if (auth?.user?.address) {
            const addr = auth.user.address
            setUserAddress({
                firstName: auth.user.firstName || "",
                lastName: auth.user.lastName || "",
                email: auth.user.email || "",
                phoneNumber: auth.user.phone || "",
                street: addr.street,
                city: addr.cityId,
                state: addr.stateId,
                postalCode: addr.postalCode,
                country: addr.countryId,
            })
        }
    }, [auth])

    useEffect(() => {
        if (usingSaved && userAddress) {
            populateSaved()
        }
    }, [usingSaved, userAddress])

    useEffect(() => {
        if (prevCountryRef.current && selectedCountry !== parseInt(prevCountryRef.current)) {
            setValue("state", "")
            setValue("city", "")
        }
        prevCountryRef.current = selectedCountry
    }, [selectedCountry, setValue])

    useEffect(() => {
        if (prevStateRef.current && selectedState !== parseInt(prevStateRef.current)) {
            setValue("city", "")
        }
        prevStateRef.current = selectedState
    }, [selectedState, setValue])

    useEffect(() => {
        if (usingSaved && isDirty) {
            setUsingSaved(false)
        }
    }, [usingSaved, isDirty, setUsingSaved])

    const {
        countries,
        isLoadingCountries,
        isErrorCountries,
        statesList,
        isLoadingStates,
        isErrorStates,
        citiesList,
        isLoadingCities,
        isErrorCities,
    } = useAddressData(selectedCountry, selectedState)

    const countryIdMap = useMemo(() => new Map(countries.map(c => [c.value, c.label])), [countries])
    const stateIdMap = useMemo(() => new Map(statesList.map(s => [s.value, s.label])), [statesList])
    const cityIdMap = useMemo(() => new Map(citiesList.map(c => [c.value, c.label])), [citiesList])

    const populateSaved = () => {
        if (!userAddress) return
        setUsingSaved(true)

        prevCountryRef.current = userAddress.country;
        prevStateRef.current = userAddress.state;

        reset({
            firstName: userAddress.firstName,
            lastName: userAddress.lastName,
            email: userAddress.email,
            phoneNumber: userAddress.phoneNumber,
            country: userAddress.country,
            state: userAddress.state,
            city: userAddress.city,
            postalCode: userAddress.postalCode,
            street: userAddress.street,
        })
    }

    const onSubmit = (data) => {
        const formatted = {
            ...data,
            country: countryIdMap.get(+data.country) || "",
            countryId: +data.country,
            state: stateIdMap.get(+data.state) || "",
            stateId: +data.state,
            city: cityIdMap.get(+data.city) || "",
            cityId: +data.city
        }
        setShippingAddress(formatted)
        setOrderCompleted(false)
        navigate("/payment")
    }

    return (
        <div className="bg-slate-50">
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <CheckoutProgress/>
                <h1 className="text-3xl font-bold text-[#1C387F] mb-4">Checkout</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-7 gap-8 py-4">
                    <div className="lg:col-span-5 space-y-6 bg-white rounded-lg drop-shadow-lg p-15">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormInput label="First Name" required placeholder="Enter First Name" className="bg-white"
                                       {...register("firstName")} error={errors.firstName?.message}/>
                            <FormInput label="Last Name" required placeholder="Enter Last Name" className="bg-white"
                                       {...register("lastName")} error={errors.lastName?.message}/>
                        </div>
                        <FormInput label="Email Address" required type="email" placeholder="Enter Email"
                                   className="bg-white" {...register("email")} error={errors.email?.message}
                                   autoComplete="email"/>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Phone Number <span className="text-red-600">*</span>
                            </label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({field}) => (
                                    <PhoneInput
                                        {...field}
                                        country="vn"
                                        inputProps={{
                                            name: "phoneNumber",
                                            required: true,
                                            autoComplete: "tel",
                                            id: "phoneNumber",
                                        }}
                                        inputClass={`w-full text-sm px-3 py-2 border rounded bg-white focus:outline-none 
                                            focus:ring-1 focus:ring-black focus:border-black
                                            ${errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                                        inputStyle={{width: "100%", color: "#111827"}}
                                    />
                                )}
                            />
                            {errors.phoneNumber && (
                                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                            )}
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <SelectField label="Country" name="country" list={countries}
                                         isLoading={isLoadingCountries} isError={isErrorCountries}
                                         control={control} error={errors.country?.message}/>
                            <SelectField label="State / Province" name="state" list={statesList}
                                         isLoading={isLoadingStates} isError={isErrorStates}
                                         control={control} error={errors.state?.message}
                                         disabled={!selectedCountry}/>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <SelectField label="City / District" name="city" list={citiesList}
                                         isLoading={isLoadingCities} isError={isErrorCities}
                                         control={control} error={errors.city?.message}
                                         disabled={!selectedState}/>
                            <FormInput label="Postal / Zip Code" required placeholder="Enter Postal Code"
                                       className="bg-white" {...register("postalCode")}
                                       error={errors.postalCode?.message}/>
                        </div>
                        <FormInput label="Street Address" required placeholder="Enter Street Address"
                                   className="bg-white" {...register("street")} error={errors.street?.message}/>
                        {userAddress && !usingSaved && (
                            <div className="mt-5 flex flex-col items-center gap-2">
                                <span className="text-sm text-gray-500">or...</span>
                                <button type="button" onClick={populateSaved}
                                        className="flex mt-3 items-center justify-center gap-1 w-60 bg-[#1C387F] text-white py-4 px-3 rounded-md text-sm font-medium hover:opacity-90 transition-colors">
                                    <MapPin className="h-4 w-4 text-white"/>
                                    <span className="leading-tight">Use your saved address</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <aside className="lg:col-span-2 sticky top-8">
                        <OrderSummary
                            itemsCount={itemsCount}
                            subtotal={subtotal}
                            shipping={shipping}
                            taxes={taxes}
                            discount={discount}
                            total={total}
                            goToPayment={handleSubmit(onSubmit)}
                        />
                    </aside>
                </form>
            </div>
        </div>
    )
}

function SelectField({label, name, list, isLoading, isError, control, error, disabled}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
                {label} <span className="text-red-600">*</span>
            </label>
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <select
                        {...field}
                        id={name}
                        disabled={disabled || isLoading || isError}
                        className={`w-full text-sm px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer
                            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                            ${disabled || isLoading || isError ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                    >
                        {isLoading ? (
                            <option>Loading {label.toLowerCase()}…</option>
                        ) : isError ? (
                            <option>Error loading {label.toLowerCase()}</option>
                        ) : (
                            <>
                                <option value="">Select {label}</option>
                                {list.map(({value, label}) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                )}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
}
