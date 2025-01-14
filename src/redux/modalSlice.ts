import { createSlice } from "@reduxjs/toolkit"

interface ModalState {
    isOpen: boolean
    isRegisterOpen: boolean
}

const initialState: ModalState = {
    isOpen: false,
    isRegisterOpen: false,
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setLoginModal: (state, action) => {
            state.isOpen = action.payload
        },
        setRegisterModal: (state, action) => {
            state.isRegisterOpen = action.payload
        },
    }
})

export const { setLoginModal, setRegisterModal } = modalSlice.actions
export default modalSlice.reducer