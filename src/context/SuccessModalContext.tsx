import React, { createContext, useContext, useState, useEffect } from 'react';
import { SuccessSaveModal } from '../components/SuccessSaveModal';

export interface SuccessModalOptions {
  title?: string;
  message?: string;
  subMessage?: string;
  buttonText?: string;
  onViewSite?: () => void;
}

interface SuccessModalContextType {
  showSuccessModal: (options?: SuccessModalOptions) => void;
  closeSuccessModal: () => void;
}

const SuccessModalContext = createContext<SuccessModalContextType>({
  showSuccessModal: () => {},
  closeSuccessModal: () => {},
});

/**
 * Global helper to trigger the success save popup from ANY handler or component
 */
export const triggerGlobalSuccessModal = (options?: SuccessModalOptions) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ecom-show-success-modal', { detail: options || {} })
    );
  }
};

export const SuccessModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    subMessage?: string;
    buttonText: string;
    onViewSite?: () => void;
  }>({
    isOpen: false,
    title: 'সফলভাবে সংরক্ষিত হয়েছে!',
    message: 'আপনার পরিবর্তনসমূহ সফলভাবে সেভ করা হয়েছে এবং ওয়েবসাইটে তাৎক্ষণিকভাবে কার্যকর হয়েছে।',
    buttonText: 'ঠিক আছে (OK)',
  });

  const showSuccessModal = (options?: SuccessModalOptions) => {
    setModalState({
      isOpen: true,
      title: options?.title || 'সফলভাবে সংরক্ষিত হয়েছে!',
      message:
        options?.message ||
        'আপনার পরিবর্তনসমূহ সফলভাবে সেভ করা হয়েছে এবং ওয়েবসাইটে তাৎক্ষণিকভাবে কার্যকর হয়েছে।',
      subMessage: options?.subMessage,
      buttonText: options?.buttonText || 'ঠিক আছে (OK)',
      onViewSite: options?.onViewSite,
    });
  };

  const closeSuccessModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SuccessModalOptions>;
      showSuccessModal(customEvent.detail);
    };

    window.addEventListener('ecom-show-success-modal', handleEvent);
    return () => window.removeEventListener('ecom-show-success-modal', handleEvent);
  }, []);

  return (
    <SuccessModalContext.Provider value={{ showSuccessModal, closeSuccessModal }}>
      {children}
      <SuccessSaveModal
        isOpen={modalState.isOpen}
        onClose={closeSuccessModal}
        title={modalState.title}
        message={modalState.message}
        subMessage={modalState.subMessage}
        buttonText={modalState.buttonText}
        onViewSite={modalState.onViewSite}
      />
    </SuccessModalContext.Provider>
  );
};

export const useSuccessModal = () => useContext(SuccessModalContext);
