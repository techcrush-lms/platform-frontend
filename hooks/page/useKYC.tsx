import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchKYC } from "@/redux/slices/orgSlice";

const useKYC = (business_id: string) => {
    const dispatch = useDispatch<AppDispatch>();

    const { kyc, loading, error } = useSelector(
        (state: RootState) => state.org
    );

    useEffect(() => {
        if (business_id) {
            dispatch(fetchKYC(business_id)).unwrap();
        }
    }, [dispatch, business_id]);

    return {
        kyc,
        loading,
        error,
    };
};

export default useKYC;
