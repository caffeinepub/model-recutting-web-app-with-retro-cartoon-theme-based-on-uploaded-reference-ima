import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Scissors, RotateCw, Eye, EyeOff } from 'lucide-react';
import type { RecutState } from './recutTypes';

interface PlaneCutControlsProps {
  state: RecutState;
  onChange: (state: RecutState) => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function PlaneCutControls({
  state,
  onChange,
  onReset,
  disabled = false
}: PlaneCutControlsProps) {
  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Scissors className="h-5 w-5" />
          Cut Controls
        </CardTitle>
        <CardDescription>Adjust the cutting plane position and orientation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="font-bold">Cut Angle: {state.cutPlane.angle}°</Label>
          <Slider
            value={[state.cutPlane.angle]}
            onValueChange={([angle]) =>
              onChange({ ...state, cutPlane: { ...state.cutPlane, angle } })
            }
            min={0}
            max={360}
            step={1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Cut Position: {state.cutPlane.offset.toFixed(2)}</Label>
          <Slider
            value={[state.cutPlane.offset]}
            onValueChange={([offset]) =>
              onChange({ ...state, cutPlane: { ...state.cutPlane, offset } })
            }
            min={-2}
            max={2}
            step={0.01}
            disabled={disabled}
          />
        </div>

        <div className="border-t-2 border-border pt-4 space-y-3">
          <Label className="font-bold">Visibility</Label>

          <div className="flex items-center justify-between">
            <Label htmlFor="part1" className="flex items-center gap-2">
              {state.visibility.part1 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Part 1
            </Label>
            <Switch
              id="part1"
              checked={state.visibility.part1}
              onCheckedChange={(part1) =>
                onChange({ ...state, visibility: { ...state.visibility, part1 } })
              }
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="part2" className="flex items-center gap-2">
              {state.visibility.part2 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Part 2
            </Label>
            <Switch
              id="part2"
              checked={state.visibility.part2}
              onCheckedChange={(part2) =>
                onChange({ ...state, visibility: { ...state.visibility, part2 } })
              }
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reference" className="flex items-center gap-2">
              Reference Model
            </Label>
            <Switch
              id="reference"
              checked={state.showReferenceModel}
              onCheckedChange={(showReferenceModel) => onChange({ ...state, showReferenceModel })}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="helper" className="flex items-center gap-2">
              Section Helper
            </Label>
            <Switch
              id="helper"
              checked={state.showSectionHelper}
              onCheckedChange={(showSectionHelper) => onChange({ ...state, showSectionHelper })}
              disabled={disabled}
            />
          </div>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full font-bold"
          disabled={disabled}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reset Cut
        </Button>
      </CardContent>
    </Card>
  );
}
