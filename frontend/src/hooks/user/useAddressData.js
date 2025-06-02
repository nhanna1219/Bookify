import { useQuery } from "@tanstack/react-query";
import {
    fetchCountries,
    fetchStates,
    fetchCities,
} from "@u_services/addressService.js";

export function useAddressData(selectedCountry, selectedState) {
    // Country
    const {
        data: countries = [],
        isLoading: isLoadingCountries,
        isError: isErrorCountries,
    } = useQuery({
        queryKey: ["countries"],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    // State
    const {
        data: statesList = [],
        isLoading: isLoadingStates,
        isError: isErrorStates,
    } = useQuery({
        queryKey: ["states", selectedCountry],
        queryFn: () => fetchStates(selectedCountry),
        enabled: !!selectedCountry,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    // City
    const {
        data: citiesList = [],
        isLoading: isLoadingCities,
        isError: isErrorCities,
    } = useQuery({
        queryKey: ["cities", selectedCountry, selectedState],
        queryFn: () =>
            fetchCities({ country: selectedCountry, state: selectedState }),
        enabled: !!selectedCountry && !!selectedState,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    return {
        countries,
        isLoadingCountries,
        isErrorCountries,
        statesList,
        isLoadingStates,
        isErrorStates,
        citiesList,
        isLoadingCities,
        isErrorCities,
    };
}
