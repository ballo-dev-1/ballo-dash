import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/toolkit';
import { openModal, closeModal, setModalMode, setIntegrationId } from '@/toolkit/IntegrationModal/reducer';

export const useIntegrationModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modalState = useSelector((state: RootState) => state.integrationModal);

  const openIntegrationModal = (mode: 'create' | 'edit' | 'view' = 'view', integrationId?: string) => {
    console.log('🔓 Opening integration modal:', { mode, integrationId });
    dispatch(openModal({ mode, integrationId }));
  };

  const closeIntegrationModal = () => {
    console.log('🔒 Closing integration modal');
    dispatch(closeModal());
  };

  const setModalModeAction = (mode: 'create' | 'edit' | 'view') => {
    console.log('🔄 Setting modal mode:', mode);
    dispatch(setModalMode(mode));
  };

  const setIntegrationIdAction = (id: string) => {
    console.log('🆔 Setting integration ID:', id);
    dispatch(setIntegrationId(id));
  };

  console.log('🔍 Current modal state:', modalState);

  return {
    // State
    isOpen: modalState.isOpen,
    mode: modalState.mode,
    integrationId: modalState.integrationId,
    
    // Actions
    openIntegrationModal,
    closeIntegrationModal,
    setModalMode: setModalModeAction,
    setIntegrationId: setIntegrationIdAction,
  };
};
