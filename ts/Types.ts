

export type Value<T> = T | (() => T) | false;

export type ComponentConverter = (value: number) => number;

export type ComponentTest = (value: number) => boolean;

export type Vec2 = { x: number, y: number };

export type Vec3 = { x: number, y: number, z: number };

export type Quat = { x: number, y: number, z: number, angle: number };

export type Color = { r: number, g: number, b: number, a: number };