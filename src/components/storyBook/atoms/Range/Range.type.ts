export interface RangeProps {
  /** Minimum selectable value */
  min?: number;
  /** Maximum selectable value */
  max?: number;
  /** Current [minValue, maxValue] */
  value?: [number, number];
  /** Default [minValue, maxValue] if uncontrolled */
  defaultValue?: [number, number];
  /** Step increment */
  step?: number;
  /** Currency / prefix symbol shown before values */
  prefix?: string;
  /** Label for the min input */
  minLabel?: string;
  /** Label for the max input */
  maxLabel?: string;
  /** Called whenever the range changes */
  onChange?: (value: [number, number]) => void;
  /** Called when the user stops changing the value (slider release or blur) */
  onChangeEnd?: (value: [number, number]) => void;
  /** Additional CSS classes for the wrapper */
  className?: string;
}
