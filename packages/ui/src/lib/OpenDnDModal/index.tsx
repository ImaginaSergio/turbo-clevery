import { useCallback, useEffect, useRef, useState } from 'react';

import { IconType } from 'react-icons/lib';
import { BiX, BiWindows, BiWindow } from 'react-icons/bi';
import { Box, Flex, Icon, useMediaQuery } from '@chakra-ui/react';

type Border =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'bottomleftCorner'
  | 'bottomRightCorner';

let anchor = { x: 0, y: 0 };

export const OpenDnDModal = ({
  state,
  children,
  minWidth = 580,
  head = { title: 'Modal' },
  onMinimize = () => {},
  onMaximize = () => {},
}: {
  minWidth?: number;
  children: React.ReactNode;
  state: { isOpen: boolean; onClose: () => void };
  head: { title: string; allowFullScreen?: boolean; icon?: IconType };
  onMinimize?: () => void;
  onMaximize?: () => void;
}) => {
  const modalRef = useRef<any>();

  const [useFullNotes] = useMediaQuery('(max-width: 1024px)');

  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const [x, setX] = useState<number>(window.innerWidth - minWidth - 50);
  const [y, setY] = useState<number>(80);
  const [h, setH] = useState<number>(minWidth);
  const [w, setW] = useState<number>(minWidth);

  const handleMouseMove = useCallback((e) => move(e, anchor), []);
  const handleResizeLB = useCallback((e) => resizeLB(e, anchor), []);
  const handleResizeRB = useCallback((e) => resizeRB(e, anchor), []);
  const handleResizeL = useCallback((e) => resizeL(e, anchor), []);
  const handleResizeR = useCallback((e) => resizeR(e, anchor), []);
  const handleResizeB = useCallback((e) => resizeB(e, anchor), []);

  //si entramos desde un tamaño predefinido, siempre será full width
  useEffect(() => {
    if (useFullNotes) handleOnMaximize();
  }, []);

  useEffect(() => {
    setX(window.innerWidth - minWidth - 50);
    setY(80);
    setH(minWidth);
    setW(minWidth);
  }, [state?.isOpen]);

  const move = (e: any, anchor: { x: number; y: number }) => {
    setX(Math.max(0, e.pageX - anchor.x));
    setY(Math.max(0, e.pageY - anchor.y));

    window.addEventListener(
      'mouseup',
      () => window.removeEventListener('mousemove', handleMouseMove),
      { once: true }
    );
  };

  /* RESIZE */
  const resizeLB = (e: any, anchor: { x: number; y: number }) => {
    if (
      anchor.x - e.pageX > minWidth &&
      anchor.x - e.pageX < window.innerWidth - 50
    ) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }

    setH(Math.max(minWidth, e.pageY - anchor.y));

    window.addEventListener(
      'mouseup',
      () => window.removeEventListener('mousemove', handleResizeLB),
      { once: true }
    );
  };

  const resizeRB = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(minWidth, e.pageX - anchor.x));
    setH(Math.max(minWidth, e.pageY - anchor.y));

    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeRB);
      },
      { once: true }
    );
  };

  const resizeL = (e: any, anchor: { x: number; y: number }) => {
    if (anchor.x - e.pageX > minWidth) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }

    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeL);
      },
      { once: true }
    );
  };

  const resizeR = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(minWidth, e.pageX - anchor.x));

    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeR);
      },
      { once: true }
    );
  };

  const resizeB = (e: any, anchor: { x: number; y: number }) => {
    setH(Math.max(minWidth, e.pageY - anchor.y));

    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeB);
      },
      { once: true }
    );
  };

  /* END RESIZE */

  /** Maximize handlers */
  const handleOnMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      onMinimize();
    } else {
      setIsMaximized(true);
      onMaximize();
    }
  };

  const handleMouseDown = async (e: any) => {
    anchor = { x: e.nativeEvent.pageX - x, y: e.nativeEvent.pageY - y };
    window.addEventListener('mousemove', handleMouseMove);
  };

  const handleDoubleClick = () => {
    setW(minWidth);
    setH(minWidth);
  };

  const onResizeMouseDown = (border: Border) => {
    switch (border) {
      case 'bottomleftCorner':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeLB);
        break;
      case 'bottomRightCorner':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeRB);
        break;
      case 'left':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeL);
        break;
      case 'right':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeR);
        break;
      case 'bottom':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeB);
        break;
    }
  };

  return (
    <Flex
      ref={modalRef}
      zIndex={100}
      bg="white"
      minH="minWidthpx"
      position="fixed"
      direction="column"
      h={isMaximized ? '100%' : h}
      w={isMaximized ? '100%' : w}
      top={`${isMaximized ? 0 : y}px`}
      left={`${isMaximized ? 0 : x}px`}
      rounded={isMaximized ? '0px' : '20px'}
      overflow="hidden"
      display={state.isOpen ? 'flex' : 'none'}
      boxShadow="0px 4px 29px rgba(0, 0, 0, 0.25)"
    >
      <Flex
        w="100%"
        bg="black"
        gap="16px"
        p="12px 20px"
        color="white"
        align="center"
        onDoubleClick={handleDoubleClick}
        roundedTop={isMaximized ? '0px' : '20px'}
        cursor={isMaximized ? 'default' : 'pointer'}
        onMouseDown={isMaximized ? () => {} : handleMouseDown}
      >
        <Icon as={head.icon} boxSize="24px" />

        <Box fontSize="14px" fontWeight="bold" lineHeight="17px">
          {head.title}
        </Box>

        <Flex align="center" ml="auto">
          {head.allowFullScreen && (
            <Icon
              as={isMaximized ? BiWindows : BiWindow}
              cursor="pointer"
              color="gray_4"
              boxSize="26px"
              onClick={handleOnMaximize}
            />
          )}

          <Icon
            data-cy="button_close_modaldnd"
            as={BiX}
            cursor="pointer"
            color="gray_4"
            boxSize="32px"
            onClick={state.onClose}
          />
        </Flex>
      </Flex>

      {children}

      {!isMaximized && (
        <>
          <Box
            w="20px"
            top="-10px"
            left="-10px"
            bottom="-10px"
            cursor="ew-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('left')}
          />

          <Box
            w="20px"
            top="-10px"
            right="-10px"
            bottom="-10px"
            cursor="ew-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('right')}
          />

          <Box
            h="20px"
            left="-10px"
            right="-10px"
            bottom="-10px"
            cursor="ns-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('bottom')}
          />

          <Box
            left="-10px"
            bottom="-10px"
            boxSize="30px"
            position="absolute"
            cursor="nesw-resize"
            onMouseDown={() => onResizeMouseDown('bottomleftCorner')}
          />

          <Box
            right="-10px"
            bottom="-10px"
            boxSize="30px"
            position="absolute"
            cursor="nwse-resize"
            onMouseDown={() => onResizeMouseDown('bottomRightCorner')}
          />
        </>
      )}
    </Flex>
  );
};
