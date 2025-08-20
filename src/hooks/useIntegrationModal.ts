/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
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
