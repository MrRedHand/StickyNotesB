import { useRef } from 'react';

type DragState = {
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startX: number;
  startY: number;
};

type UseNoteDragOptions = {
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
  onStart?: () => void;
  onEnd?: (x: number, y: number) => void;
};

export function useNoteInteractions({
  x,
  y,
  onMove,
  onStart,
  onEnd,
}: UseNoteDragOptions) {
  const dragRef = useRef<DragState | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: x,
      startY: y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);

    onStart?.();
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startPointerX;
    const deltaY = event.clientY - drag.startPointerY;

    const nextX = drag.startX + deltaX;
    const nextY = drag.startY + deltaY;

    onMove(nextX, nextY);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startPointerX;
    const deltaY = event.clientY - drag.startPointerY;

    const finalX = drag.startX + deltaX;
    const finalY = drag.startY + deltaY;

    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    onEnd?.(finalX, finalY);
  };

  const handlePointerCancel = (event: React.PointerEvent) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}