import { useState } from 'react'
import { Slider, RangeSlider } from '@/components/ui/Slider'
import { Counter, CompactCounter } from '@/components/ui/Counter'
import { Signature, CompactSignature } from '@/components/ui/Signature'
import {
  ColorPicker,
  ColorInput,
  ColorSwatch,
  GradientPicker,
  defaultPresets,
} from '@/components/ui/ColorPicker'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function SpecialInputsDemo() {
  useScrollToSection()
  const [sliderValue, setSliderValue] = useState([50])
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75])
  const [counter, setCounter] = useState(5)
  const [signature, setSignature] = useState<string | null>(null)
  const [color, setColor] = useState('#3b82f6')
  const [gradient, setGradient] = useState({ from: '#3b82f6', to: '#8b5cf6', direction: 'to right' })

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Special Inputs"
        description="Slider, counter, signature capture, and color picker components for specialized input needs."
      />

      {/* Slider */}
      <DemoCard id="slider" title="Slider - Range Input">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Single or dual-handle slider for numeric range selection. Built on Radix UI.
          </p>
          <CodeBlock
            code={`// Single slider
<Slider
  value={[value]}
  onValueChange={([v]) => setValue(v)}
  min={0}
  max={100}
  step={1}
  showValue
  label="Volume"
  formatValue={(v) => \`\${v}%\`}
/>

// Range slider (two handles)
<RangeSlider
  value={[min, max]}
  onValueChange={([min, max]) => setRange([min, max])}
  min={0}
  max={1000}
  showValue
  formatRange={(min, max) => \`$\${min} - $\${max}\`}
/>`}
            id="slider"
          />
          <div className="space-y-6 pt-2">
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              min={0}
              max={100}
              label="Volume"
              showValue
              formatValue={(v) => `${v}%`}
            />

            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              min={0}
              max={10}
              step={0.5}
              label="Rating"
              showValue
            />

            <RangeSlider
              value={rangeValue}
              onValueChange={(v) => setRangeValue(v as [number, number])}
              min={0}
              max={1000}
              step={10}
              label="Price Range"
              showValue
              formatRange={(min, max) => `$${min} - $${max}`}
            />

            <RangeSlider
              value={rangeValue}
              onValueChange={(v) => setRangeValue(v as [number, number])}
              min={0}
              max={100}
              label="Age Range"
              showValue
              formatRange={(min, max) => `${min} to ${max} years`}
            />
          </div>
        </div>
      </DemoCard>

      {/* Counter */}
      <DemoCard id="counter" title="Counter - Numeric Stepper">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Numeric input with increment/decrement buttons. Different variants available.
          </p>
          <CodeBlock
            code={`<Counter
  value={count}
  onChange={setCount}
  min={0}
  max={100}
  step={1}
  size="md"
  variant="default"
/>

// Variants: default, outline, ghost
// Sizes: sm, md, lg

// Compact version
<CompactCounter
  value={count}
  onChange={setCount}
/>`}
            id="counter"
          />
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Small:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  min={0}
                  max={100}
                  size="sm"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Medium:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  min={0}
                  max={100}
                  size="md"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Large:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  min={0}
                  max={100}
                  size="lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Default:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  variant="default"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Outline:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  variant="outline"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Ghost:</p>
                <Counter
                  value={counter}
                  onChange={setCounter}
                  variant="ghost"
                />
              </div>
            </div>

            <div>
              <p className="text-xs mb-2 text-muted-foreground">Compact (for inline use):</p>
              <CompactCounter
                value={counter}
                onChange={setCounter}
                min={1}
                max={99}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Signature */}
      <DemoCard id="signature" title="Signature - Digital Signature Capture">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Canvas-based signature capture with undo, clear, and save. Built on signature_pad.
          </p>
          <CodeBlock
            code={`<Signature
  value={signature}
  onSignature={setSignature}
  height={200}
  penColor="#000000"
  backgroundColor="#ffffff"
  showControls
  placeholder="Sign here"
/>

// Compact version (click to edit)
<CompactSignature
  value={signature}
  onSignature={setSignature}
  height={120}
/>`}
            id="signature"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Full signature pad:
              </p>
              <Signature
                value={signature}
                onSignature={setSignature}
                height={200}
                showControls
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Compact signature (click to edit):
              </p>
              <CompactSignature
                value={signature}
                onSignature={setSignature}
                height={120}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* ColorPicker */}
      <DemoCard id="color-picker" title="ColorPicker - Color Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Comprehensive color selection with hex input, presets, and gradients. Built on react-colorful.
          </p>
          <CodeBlock
            code={`// Popover color picker
<ColorPicker
  value={color}
  onChange={setColor}
  presets={defaultPresets}
  showInput
  size="md"
/>

// Inline color input
<ColorInput
  value={color}
  onChange={setColor}
  presets={presets}
/>

// Color swatch grid
<ColorSwatch
  value={color}
  onChange={setColor}
  colors={defaultPresets}
  columns={5}
  size="md"
/>

// Gradient picker
<GradientPicker
  value={{ from: '#3b82f6', to: '#8b5cf6', direction: 'to right' }}
  onChange={setGradient}
/>`}
            id="color-picker"
          />
          <div className="space-y-6 pt-2">
            <div className="flex gap-4 items-start">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Popover picker (small):
                </p>
                <ColorPicker
                  value={color}
                  onChange={setColor}
                  size="sm"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Popover picker (medium):
                </p>
                <ColorPicker
                  value={color}
                  onChange={setColor}
                  size="md"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Popover picker (large):
                </p>
                <ColorPicker
                  value={color}
                  onChange={setColor}
                  size="lg"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Inline color input:
              </p>
              <ColorInput
                value={color}
                onChange={setColor}
                presets={defaultPresets.slice(0, 10)}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Color swatch grid:
              </p>
              <ColorSwatch
                value={color}
                onChange={setColor}
                colors={defaultPresets}
                columns={10}
                size="md"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Gradient picker:
              </p>
              <GradientPicker
                value={gradient}
                onChange={setGradient}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Props Reference */}
      <DemoCard title="Props Reference">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Component</th>
                <th className="text-left py-2 pr-4">Key Props</th>
                <th className="text-left py-2">Value Type</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">Slider</td>
                <td className="py-2 pr-4">value, onValueChange, min, max, step, showValue</td>
                <td className="py-2">number[]</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">RangeSlider</td>
                <td className="py-2 pr-4">value, onValueChange, formatRange</td>
                <td className="py-2">[number, number]</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Counter</td>
                <td className="py-2 pr-4">value, onChange, min, max, size, variant</td>
                <td className="py-2">number</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Signature</td>
                <td className="py-2 pr-4">value, onSignature, height, penColor, showControls</td>
                <td className="py-2">string (base64)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ColorPicker</td>
                <td className="py-2 pr-4">value, onChange, presets, showInput, size</td>
                <td className="py-2">string (hex)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ColorInput</td>
                <td className="py-2 pr-4">value, onChange, presets</td>
                <td className="py-2">string (hex)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ColorSwatch</td>
                <td className="py-2 pr-4">value, onChange, colors, columns, size</td>
                <td className="py-2">string (hex)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">GradientPicker</td>
                <td className="py-2 pr-4">value, onChange</td>
                <td className="py-2">{`{ from, to, direction }`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
