import React, { SetStateAction, useEffect } from "react";

interface CloseMenuOnOutsideClickProps {
  showMenu: boolean;
  showMenuRef: React.RefObject<HTMLElement | null>;
  setShowMenu: React.Dispatch<SetStateAction<boolean>>;
}

export const useCloseMenuWhenClickedOutside = ({
  showMenu,
  showMenuRef,
  setShowMenu,
}: CloseMenuOnOutsideClickProps) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (
        showMenu &&
        showMenuRef.current &&
        !showMenuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setShowMenu, showMenu, showMenuRef]);
};
