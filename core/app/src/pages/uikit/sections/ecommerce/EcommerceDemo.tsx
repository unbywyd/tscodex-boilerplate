import { useState } from 'react'
import { PriceTag, PriceRangeDisplay } from '@/components/ui/PriceTag'
import { QuantitySelector, CompactQuantity, Stepper } from '@/components/ui/QuantitySelector'
import { SizeSelector, SizePills, SizeGrid } from '@/components/ui/SizeSelector'
import { ColorSelector, ColorDot, ColorStack } from '@/components/ui/ColorSelector'
import { StarRating } from '@/components/ui/StarRating'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function EcommerceDemo() {
  useScrollToSection()
  const [quantity, setQuantity] = useState(1)
  const [compactQty, setCompactQty] = useState(2)
  const [size, setSize] = useState('M')
  const [color, setColor] = useState('#3b82f6')
  const [rating, setRating] = useState(4)

  const sizeOptions = [
    { value: 'XS', label: 'XS', available: false },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ]

  const colorOptions = [
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'white', label: 'White', color: '#FFFFFF' },
    { value: 'red', label: 'Red', color: '#EF4444' },
    { value: 'blue', label: 'Blue', color: '#3B82F6' },
    { value: 'green', label: 'Green', color: '#22C55E', available: false },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="E-commerce Components"
        description="Price tags, quantity selectors, size/color pickers, and star ratings for e-commerce interfaces."
      />

      {/* PriceTag */}
      <DemoCard id="price-tag" title="PriceTag - Product Price Display">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Display prices with original price, discounts, currency symbols, and suffixes.
          </p>
          <CodeBlock
            code={`<PriceTag
  price={79.99}
  originalPrice={99.99}
  currency="$"
  size="lg"
  showDiscount
/>

// With suffix
<PriceTag
  price={49}
  suffix="/month"
  size="md"
/>

// Free price
<PriceTag
  price={0}
  freeText="Free"
/>`}
            id="price-tag"
          />
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-6">
              <PriceTag price={29.99} size="sm" />
              <PriceTag price={49.99} size="md" />
              <PriceTag price={79.99} size="lg" />
              <PriceTag price={199.99} size="xl" />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <PriceTag
                price={79.99}
                originalPrice={99.99}
                size="lg"
              />
              <PriceTag
                price={149}
                originalPrice={299}
                size="lg"
                showDiscount
              />
              <PriceTag
                price={49.99}
                originalPrice={79.99}
                size="md"
                discountText="40% OFF"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <PriceTag
                price={9.99}
                suffix="/month"
                size="md"
              />
              <PriceTag
                prefix="From"
                price={299}
                size="md"
              />
              <PriceTag
                price={0}
                freeText="Free"
                size="md"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Stacked layout:</p>
              <PriceTag
                price={79.99}
                originalPrice={99.99}
                layout="stacked"
                size="lg"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Price range:</p>
              <PriceRangeDisplay min={29} max={199} currency="$" />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* QuantitySelector */}
      <DemoCard id="quantity-selector" title="QuantitySelector - Quantity Input">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Quantity input with increment/decrement buttons. Multiple variants available.
          </p>
          <CodeBlock
            code={`<QuantitySelector
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={99}
  size="md"
  showDelete
  onDelete={() => console.log('Delete item')}
/>

// Compact (inline)
<CompactQuantity
  value={qty}
  onChange={setQty}
/>

// Stepper (vertical)
<Stepper
  value={count}
  onChange={setCount}
  label="Items"
/>`}
            id="quantity-selector"
          />
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Small:</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                  size="sm"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Medium:</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                  size="md"
                />
              </div>
              <div>
                <p className="text-xs mb-2 text-muted-foreground">Large:</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                  size="lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs mb-2 text-muted-foreground">With delete (0 shows trash icon):</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={0}
                  max={99}
                  showDelete
                  onDelete={() => console.log('Delete')}
                />
              </div>

              <div>
                <p className="text-xs mb-2 text-muted-foreground">Compact:</p>
                <CompactQuantity
                  value={compactQty}
                  onChange={setCompactQty}
                  min={1}
                  max={99}
                />
              </div>

              <div>
                <p className="text-xs mb-2 text-muted-foreground">Stepper:</p>
                <Stepper
                  value={quantity}
                  onChange={setQuantity}
                  min={0}
                  max={99}
                  label="Qty"
                />
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* SizeSelector */}
      <DemoCard id="size-selector" title="SizeSelector - Size Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select product sizes with availability indicators. Multiple layouts available.
          </p>
          <CodeBlock
            code={`<SizeSelector
  options={[
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL', available: false },
  ]}
  value={size}
  onChange={setSize}
  variant="outline"
/>

// Pills variant
<SizePills
  options={sizes}
  value={size}
  onChange={setSize}
/>

// Grid layout
<SizeGrid
  options={sizes}
  value={size}
  onChange={setSize}
  columns={5}
/>`}
            id="size-selector"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Default variant:
              </p>
              <SizeSelector
                options={sizeOptions}
                value={size}
                onChange={setSize}
                variant="default"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Outline variant:
              </p>
              <SizeSelector
                options={sizeOptions}
                value={size}
                onChange={setSize}
                variant="outline"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Pills variant:
              </p>
              <SizePills
                options={sizeOptions}
                value={size}
                onChange={setSize}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Grid layout (shoe sizes):
              </p>
              <SizeGrid
                options={[
                  { value: '7', label: '7' },
                  { value: '7.5', label: '7.5' },
                  { value: '8', label: '8' },
                  { value: '8.5', label: '8.5' },
                  { value: '9', label: '9' },
                  { value: '9.5', label: '9.5' },
                  { value: '10', label: '10' },
                  { value: '10.5', label: '10.5', available: false },
                  { value: '11', label: '11' },
                  { value: '11.5', label: '11.5' },
                ]}
                value={size}
                onChange={setSize}
                columns={5}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* ColorSelector */}
      <DemoCard id="color-selector" title="ColorSelector - Color Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Color/swatch selection for product variants. Shows available colors.
          </p>
          <CodeBlock
            code={`<ColorSelector
  options={[
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'blue', label: 'Blue', color: '#3B82F6' },
    { value: 'red', label: 'Red', color: '#EF4444', available: false },
  ]}
  value={color}
  onChange={setColor}
  size="md"
  variant="circle"
  showSelectedLabel
/>

// Simple color dot
<ColorDot color="#3B82F6" size="md" />

// Color stack (multiple colors)
<ColorStack colors={['#000', '#fff', '#f00', '#00f']} max={3} />`}
            id="color-selector"
          />
          <div className="space-y-6 pt-2">
            <ColorSelector
              options={colorOptions}
              value={color}
              onChange={setColor}
              size="md"
              variant="circle"
              showSelectedLabel
            />

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                With labels below:
              </p>
              <ColorSelector
                options={colorOptions}
                value={color}
                onChange={setColor}
                size="md"
                variant="circle"
                showLabel
                showSelectedLabel={false}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Square and rounded variants:
              </p>
              <div className="flex gap-6">
                <ColorSelector
                  options={colorOptions.slice(0, 4)}
                  value={color}
                  onChange={setColor}
                  variant="square"
                  showSelectedLabel={false}
                />
                <ColorSelector
                  options={colorOptions.slice(0, 4)}
                  value={color}
                  onChange={setColor}
                  variant="rounded"
                  showSelectedLabel={false}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">Color dots:</p>
                <div className="flex gap-2">
                  <ColorDot color="#000000" size="sm" />
                  <ColorDot color="#EF4444" size="md" />
                  <ColorDot color="#3B82F6" size="lg" />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">Color stack:</p>
                <ColorStack
                  colors={['#000000', '#FFFFFF', '#EF4444', '#3B82F6', '#22C55E']}
                  max={3}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* StarRating */}
      <DemoCard id="star-rating" title="StarRating - Rating Input">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Star rating input and display. Supports half stars and read-only mode.
          </p>
          <CodeBlock
            code={`<StarRating
  value={rating}
  onChange={setRating}
  max={5}
  size="md"
  showValue
/>

// Read-only
<StarRating
  value={4.5}
  readOnly
  allowHalf
  size="sm"
/>

// With label
<StarRating
  value={rating}
  onChange={setRating}
  label="Rate this product"
  showValue
/>`}
            id="star-rating"
          />
          <div className="space-y-6 pt-2">
            <div className="flex gap-6">
              <StarRating
                value={rating}
                onChange={setRating}
                size="sm"
              />
              <StarRating
                value={rating}
                onChange={setRating}
                size="md"
              />
              <StarRating
                value={rating}
                onChange={setRating}
                size="lg"
              />
            </div>

            <StarRating
              value={rating}
              onChange={setRating}
              label="Rate this product"
              showValue
            />

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                With half stars:
              </p>
              <StarRating
                value={3.5}
                onChange={setRating}
                allowHalf
                showValue
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Read-only (display):
              </p>
              <div className="flex flex-col gap-2">
                <StarRating value={5} readOnly size="sm" showValue />
                <StarRating value={4.5} readOnly allowHalf size="sm" showValue />
                <StarRating value={3} readOnly size="sm" showValue />
                <StarRating value={2} readOnly size="sm" showValue />
                <StarRating value={1} readOnly size="sm" showValue />
              </div>
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
                <td className="py-2 pr-4">PriceTag</td>
                <td className="py-2 pr-4">price, originalPrice, currency, suffix, layout</td>
                <td className="py-2">number</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">QuantitySelector</td>
                <td className="py-2 pr-4">value, onChange, min, max, showDelete</td>
                <td className="py-2">number</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SizeSelector</td>
                <td className="py-2 pr-4">options, value, onChange, variant</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ColorSelector</td>
                <td className="py-2 pr-4">options, value, onChange, variant, showLabel</td>
                <td className="py-2">string</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">StarRating</td>
                <td className="py-2 pr-4">value, onChange, max, allowHalf, readOnly</td>
                <td className="py-2">number</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
