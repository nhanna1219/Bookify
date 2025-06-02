import { useContext, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { checkoutSchema } from "@utils/validate.js"
import { MapPin, Edit2 } from "lucide-react"
import FormInput from "@u_components/shared/FormInput.jsx"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import OrderSummary from "@u_components/checkout/OrderSummary.jsx"
import {useLocation, useNavigate, useNavigationType} from "react-router-dom"
import CheckoutProgress from "@u_components/checkout/CheckoutProgress.jsx"
import { useAddressData } from "@u_hooks/useAddressData.js"
import { AuthContext } from "@contexts/AuthContext.jsx"

export default function CheckoutPage() {
    const { auth } = useContext(AuthContext)
    const { state } = useLocation()
    const navigate = useNavigate()
    const navigationType = useNavigationType()

    useEffect(() => {
        if (sessionStorage.getItem('orderFlowCompleted') === 'true' || !state || !state.items || state.items.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [state, navigate]);

    const { itemsCount = 0, subtotal = 0, shipping = 0, taxes = 0, discount = 0, total = 0 } = state || {}

    const savedForm = sessionStorage.getItem("checkoutForm")
    const savedUsing = sessionStorage.getItem("checkoutUsingSaved") === "true"

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {},
    })

    const allValues = watch()
    useEffect(() => {
        const serialized = JSON.stringify(allValues)
        const prev = sessionStorage.getItem("checkoutForm")
        if (prev !== serialized) {
            sessionStorage.setItem("checkoutForm", serialized)
        }
    }, [allValues])

    const selectedCountry = watch("country")
    const selectedState = watch("state")

    const [userAddress, setUserAddress] = useState(null)
    const [usingSaved, setUsingSaved] = useState(false)
    const [editingLoc, setEditingLoc] = useState(false)

    useEffect(() => {
        if (navigationType === "POP") {
            navigate("/cart", { replace: true });
        }
    }, [navigationType, navigate]);

    useEffect(() => {
        if (auth?.user?.address) {
            const addr = auth.user.address
            setUserAddress({
                firstName: auth.user.firstName || "",
                lastName: auth.user.lastName || "",
                email: auth.user.email || "",
                phone: auth.user.phone || "",
                street: addr.street,
                city: addr.city,
                state: addr.state,
                postalCode: addr.postalCode,
                country: addr.country,
            })
        }
    }, [auth])

    useEffect(() => {
        if (savedForm) {
            reset(JSON.parse(savedForm))
        }
        if (savedUsing && userAddress) {
            populateSaved()
        }
    }, [reset, userAddress, savedUsing])

    useEffect(() => {
        if (
            editingLoc &&
            selectedCountry &&
            selectedCountry !== userAddress?.country
        ) {
            setValue("state", "")
            setValue("city", "")
        }
    }, [selectedCountry, setValue, editingLoc, userAddress])

    useEffect(() => {
        if (
            editingLoc &&
            selectedState &&
            selectedState !== userAddress?.state
        ) {
            setValue("city", "")
        }
    }, [selectedState, setValue, editingLoc, userAddress])

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

    const populateSaved = () => {
        if (!userAddress) return
        setUsingSaved(true)
        sessionStorage.setItem("checkoutUsingSaved", "true")
        setEditingLoc(false)
        setValue("firstName", userAddress.firstName)
        setValue("lastName", userAddress.lastName)
        setValue("email", userAddress.email)
        setValue("phoneNumber", userAddress.phone)
        setValue("country", userAddress.country)
        setValue("state", userAddress.state)
        setValue("city", userAddress.city)
        setValue("postalCode", userAddress.postalCode)
        setValue("street", userAddress.street)
    }

    const enableEdit = () => {
        setUsingSaved(false)
        sessionStorage.setItem("checkoutUsingSaved", "false")
        setEditingLoc(true)
        setValue("country", userAddress.country)
        setValue("state", userAddress.state)
        setValue("city", userAddress.city)
    }

    const onSubmit = (data) => {
        sessionStorage.setItem("checkoutForm", JSON.stringify(data))
        sessionStorage.setItem("checkoutUsingSaved", usingSaved.toString())
        navigate("/payment", {
            state: {
                ...state,
                shippingAddress: data,
            },
        })
    }

    function LocationField({ label, name, list, isLoading, isError, watchingDependencies }) {
        const savedVal = userAddress?.[name]
        const disabledRead = usingSaved && !editingLoc
        const needFetchError = isError && !(usingSaved && !editingLoc)

        return (
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    {label} <span className="text-red-600">*</span>
                </label>
                {disabledRead ? (
                    <div className="relative">
                        <FormInput
                            value={savedVal}
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={enableEdit}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                ) : (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                id={name}
                                disabled={
                                    watchingDependencies.some((dep) => !dep) || isLoading || isError
                                }
                                className={`w-full text-sm px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer
                  ${
                                    errors[name]
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300"
                                } ${
                                    watchingDependencies.some((dep) => !dep) || isLoading || isError
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                }`}
                            >
                                {isLoading ? (
                                    <option>Loading {label.toLowerCase()}…</option>
                                ) : needFetchError ? (
                                    <option>Error loading {label.toLowerCase()}</option>
                                ) : (
                                    <>
                                        <option value="">
                                            Select {label.replace(" / ", " / ").split(" ")[0]}
                                        </option>
                                        {list.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                        {usingSaved &&
                                            !editingLoc &&
                                            savedVal &&
                                            !list.includes(savedVal) && (
                                                <option value={savedVal}>{savedVal}</option>
                                            )}
                                    </>
                                )}
                            </select>
                        )}
                    />
                )}
                {errors[name] && (
                    <p className="text-sm text-red-500 mt-1">{errors[name]?.message}</p>
                )}
            </div>
        )
    }

    return (
        <div className={"bg-slate-50"}>
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <CheckoutProgress />
                <h1 className="text-3xl font-bold text-[#1C387F] mb-4">Checkout</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid lg:grid-cols-7 gap-8 py-4"
                >
                    <div className="lg:col-span-5 space-y-6 bg-white rounded-lg drop-shadow-lg p-15">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormInput
                                label="First Name"
                                required
                                placeholder="Enter First Name"
                                className="bg-white"
                                {...register("firstName")}
                                error={errors.firstName?.message}
                            />
                            <FormInput
                                label="Last Name"
                                required
                                placeholder="Enter Last Name"
                                className="bg-white"
                                {...register("lastName")}
                                error={errors.lastName?.message}
                            />
                        </div>
                        <FormInput
                            label="Email Address"
                            required
                            type="email"
                            placeholder="Enter Email"
                            className="bg-white"
                            {...register("email")}
                            error={errors.email?.message}
                            autoComplete="email"
                        />
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Phone Number <span className="text-red-600">*</span>
                            </label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field}
                                        country={"vn"}
                                        inputProps={{
                                            name: "phoneNumber",
                                            required: true,
                                            autoComplete: "tel",
                                            id: "phoneNumber",
                                        }}
                                        inputClass={`w-full text-sm px-3 py-2 border rounded bg-white focus:outline-none 
                    focus:ring-1 focus:ring-black focus:border-black
                    ${
                                            errors.phoneNumber
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300"
                                        }`}
                                        inputStyle={{ width: "100%", color: "#111827" }}
                                    />
                                )}
                            />
                            {errors.phoneNumber && (
                                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                            )}
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <LocationField
                                label="Country"
                                name="country"
                                list={countries}
                                isLoading={isLoadingCountries}
                                isError={isErrorCountries}
                                watchingDependencies={[true]}
                            />
                            <LocationField
                                label="State / Province"
                                name="state"
                                list={statesList}
                                isLoading={isLoadingStates}
                                isError={isErrorStates}
                                watchingDependencies={[selectedCountry]}
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <LocationField
                                label="City / District"
                                name="city"
                                list={citiesList}
                                isLoading={isLoadingCities}
                                isError={isErrorCities}
                                watchingDependencies={[selectedState]}
                            />
                            <FormInput
                                label="Postal / Zip Code"
                                required
                                placeholder="Enter Postal Code"
                                className="bg-white"
                                {...register("postalCode")}
                                error={errors.postalCode?.message}
                            />
                        </div>
                        <FormInput
                            label="Street Address"
                            required
                            placeholder="Enter Street Address"
                            className="bg-white"
                            {...register("street")}
                            error={errors.street?.message}
                        />
                        {userAddress && !usingSaved && (
                            <div className="mt-5 flex flex-col items-center gap-2">
                                <span className="text-sm text-gray-500">or...</span>
                                <button
                                    type="button"
                                    onClick={populateSaved}
                                    className="flex mt-3 items-center justify-center gap-1 w-60 bg-[#1C387F] text-white py-4 px-3 rounded-md text-sm font-medium hover:opacity-90 transition-colors"
                                >
                                    <MapPin className="h-4 w-4 text-white" />
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
