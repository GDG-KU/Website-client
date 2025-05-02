"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  closeButton?: boolean;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <StyledOverlay
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}>
      <div>{children}</div>
    </StyledOverlay>,
    document.body,
  );
};

export default Modal;

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5);

  z-index: 9000;

  > div {
    padding: 1rem;

    border-radius: 1rem;

    filter: drop-shadow(rgba(0, 0, 0, 0.06) 0 2px 20px);
    background-color: #ffffff;
  }
`;
