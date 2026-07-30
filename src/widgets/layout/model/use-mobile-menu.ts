import { useLocalStorage } from 'usehooks-ts';

const MOBILE_MENU_STORAGE_KEY = 'layout.mobile-menu-open';

export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useLocalStorage(MOBILE_MENU_STORAGE_KEY, false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};
