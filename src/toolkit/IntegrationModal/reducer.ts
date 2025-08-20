import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IntegrationModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  integrationId?: string;
}

const initialState: IntegrationModalState = {
  isOpen: false,
  mode: 'view',
  integrationId: undefined,
};

const integrationModalSlice = createSlice({
  name: 'integrationModal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ mode?: 'create' | 'edit' | 'view'; integrationId?: string }>) => {
      state.isOpen = true;
      state.mode = action.payload.mode || 'view';
      state.integrationId = action.payload.integrationId;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.mode = 'view';
      state.integrationId = undefined;
    },
    setModalMode: (state, action: PayloadAction<'create' | 'edit' | 'view'>) => {
      state.mode = action.payload;
    },
    setIntegrationId: (state, action: PayloadAction<string>) => {
      state.integrationId = action.payload;
    },
  },
});

export const { openModal, closeModal, setModalMode, setIntegrationId } = integrationModalSlice.actions;
export default integrationModalSlice.reducer;
