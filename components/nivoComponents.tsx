import { BulletRectsItemProps, BulletMarkersItemProps } from '@nivo/bullet';
import { FC } from 'react';

export const CustomMeasure: FC<BulletRectsItemProps> = ({
  x,
  y,
  width,
  height,
  color,
}) => {
  return (
    <rect
      x={x}
      y={y}
      rx={5}
      width={width}
      height={height}
      strokeLinejoin="round"
      fill={color}
    ></rect>
  );
};

export const CustomRange: FC<BulletRectsItemProps> = ({
  x,
  y,
  width,
  height,
  color,
}) => {
  return (
    <rect
      x={x}
      y={y}
      rx={7}
      width={width}
      height={height}
      strokeLinejoin="round"
      fill={color}
    ></rect>
  );
};

export const CustomMarker: FC<BulletMarkersItemProps> = ({ x, y, color }) => {
  return (
    <rect x={x} y={y + 3} ry={5} strokeLinejoin="round" fill={color}></rect>
  );
};
