import { useEffect, useLayoutEffect, useState } from "react";
import type { TooltipPlacement } from "./tooltip.types";

interface PositionState {
  top: number;
  left: number;
  actualSide: "top" | "bottom" | "left" | "right";
}

type Side = "top" | "bottom" | "left" | "right";

const VIEWPORT_PADDING = 8;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function resolveAutoPlacement(
  spaceTop: number,
  spaceBottom: number,
  spaceLeft: number,
  spaceRight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  spacing: number,
): Side {
  if (spaceTop >= tooltipHeight + spacing) return "top";
  if (spaceBottom >= tooltipHeight + spacing) return "bottom";
  if (spaceLeft >= tooltipWidth + spacing) return "left";
  if (spaceRight >= tooltipWidth + spacing) return "right";
  return "top";
}

function resolveActualSide(
  targetPlacement: Side,
  spaceTop: number,
  spaceBottom: number,
  spaceLeft: number,
  spaceRight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  spacing: number,
): Side {
  const needsHeight = tooltipHeight + spacing;
  const needsWidth = tooltipWidth + spacing;

  if (targetPlacement === "top")
    return spaceTop < needsHeight && spaceBottom >= needsHeight ? "bottom" : "top";
  if (targetPlacement === "bottom")
    return spaceBottom < needsHeight && spaceTop >= needsHeight ? "top" : "bottom";
  if (targetPlacement === "left")
    return spaceLeft < needsWidth && spaceRight >= needsWidth ? "right" : "left";
  return spaceRight < needsWidth && spaceLeft >= needsWidth ? "left" : "right";
}

function calculateXY(
  side: Side,
  anchorRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  spacing: number,
): { top: number; left: number } {
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  const anchorCenterY = anchorRect.top + anchorRect.height / 2;

  if (side === "top") return { top: anchorRect.top - tooltipHeight - spacing, left: anchorCenterX - tooltipWidth / 2 };
  if (side === "bottom") return { top: anchorRect.bottom + spacing, left: anchorCenterX - tooltipWidth / 2 };
  if (side === "left") return { top: anchorCenterY - tooltipHeight / 2, left: anchorRect.left - tooltipWidth - spacing };
  return { top: anchorCenterY - tooltipHeight / 2, left: anchorRect.right + spacing };
}

function clampToViewport(
  side: Side,
  top: number,
  left: number,
  tooltipWidth: number,
  tooltipHeight: number,
): { top: number; left: number } {
  const isVertical = side === "top" || side === "bottom";
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (isVertical) {
    left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - VIEWPORT_PADDING - tooltipWidth));
  } else {
    top = Math.max(VIEWPORT_PADDING, Math.min(top, viewportHeight - VIEWPORT_PADDING - tooltipHeight));
  }

  return { top, left };
}

export function useTooltipPosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  tooltipRef: React.RefObject<HTMLElement | null>,
  placement: TooltipPlacement,
  spacing: number,
  isVisible: boolean,
): PositionState {
  const [position, setPosition] = useState<PositionState>({
    top: -9999,
    left: -9999,
    actualSide: placement === "auto" ? "top" : placement,
  });

  useIsomorphicLayoutEffect(() => {
    if (!isVisible || !anchorRef.current || !tooltipRef.current) return;

    const calculatePosition = () => {
      const anchorEl = anchorRef.current;
      const tooltipEl = tooltipRef.current;
      if (!anchorEl || !tooltipEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;

      const spaceTop = anchorRect.top;
      const spaceBottom = window.innerHeight - anchorRect.bottom;
      const spaceLeft = anchorRect.left;
      const spaceRight = window.innerWidth - anchorRect.right;

      const targetSide: Side =
        placement === "auto"
          ? resolveAutoPlacement(spaceTop, spaceBottom, spaceLeft, spaceRight, tooltipWidth, tooltipHeight, spacing)
          : placement;

      const actualSide = resolveActualSide(
        targetSide,
        spaceTop,
        spaceBottom,
        spaceLeft,
        spaceRight,
        tooltipWidth,
        tooltipHeight,
        spacing,
      );

      const { top, left } = calculateXY(actualSide, anchorRect, tooltipWidth, tooltipHeight, spacing);
      const clamped = clampToViewport(actualSide, top, left, tooltipWidth, tooltipHeight);

      setPosition({ ...clamped, actualSide });
    };

    calculatePosition();

    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);

    const resizeObserver = new ResizeObserver(calculatePosition);
    if (anchorRef.current) resizeObserver.observe(anchorRef.current);
    if (tooltipRef.current) resizeObserver.observe(tooltipRef.current);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
      resizeObserver.disconnect();
    };
  }, [isVisible, placement, spacing, anchorRef, tooltipRef]);

  return position;
}
