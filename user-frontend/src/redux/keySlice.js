import { createSlice } from '@reduxjs/toolkit';

export const keySlice = createSlice({

    name: 'key'

    , initialState: {
        keyData: null,
        referralCode: null
    }

    , reducers: {
        keyDetails: (state, data) => {
            console.debug('redux/keySlice: keyDetails(state, data)', state, data);
            state.keyData = data.payload;
        }
        , referralCodeUpdate:(state, data) => {
            console.debug('redux/keySlice: referralCodeUpdate(state, data)', state, data);
            state.referralCode = data?.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { keyDetails, referralCodeUpdate } = keySlice.actions;
export default keySlice.reducer;