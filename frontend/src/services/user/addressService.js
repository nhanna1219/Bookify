import api from "../api.js";

export const fetchCountries = async () => {
    const res = await api.get("https://countriesnow.space/api/v0.1/countries/iso");
    return (res.data.data || []).map(item => item.name).sort();
};

export const fetchStates = async (country) => {
    if (!country) return [];
    const res = await api.post("https://countriesnow.space/api/v0.1/countries/states", {
        country
    });
    return (res.data.data?.states || []).map(s => s.name).sort();
};

export const fetchCities = async ({ country, state }) => {
    if (!country || !state) return [];
    const res = await api.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country,
        state
    });
    return res.data.data?.sort() || [];
};
