import { useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'
import { TimePicker } from '@/components/ui/TimePicker'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function DateTimeDemo() {
  useScrollToSection()
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string | undefined>()

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Date & Time"
        description="Date picker with calendar popup and time picker with hour/minute selection."
      />

      {/* DatePicker */}
      <DemoCard id="datepicker" title="DatePicker - Calendar Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Date picker with calendar popup. Uses react-day-picker under the hood. Supports manual input and locale.
          </p>
          <CodeBlock
            code={`<DatePicker
  label="Birth Date"
  value={date}
  onChange={setDate}
  placeholder="Select date"
  dateFormat="dd.MM.yyyy"
  locale="en"
/>`}
            id="datepicker"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <DatePicker
              label="Date (EN)"
              value={date}
              onChange={setDate}
              placeholder="Select date"
            />
            <DatePicker
              label="Date (RU locale)"
              locale="ru"
              placeholder="Выберите дату"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="With Error"
              error="Date is required"
            />
            <DatePicker
              label="Disabled"
              disabled
              value={new Date()}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{date?.toISOString() || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* TimePicker */}
      <DemoCard id="timepicker" title="TimePicker - Hour & Minute Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Time picker with scrollable hour/minute columns. Supports quick presets and configurable minute steps.
          </p>
          <CodeBlock
            code={`<TimePicker
  label="Start Time"
  value={time}
  onChange={setTime}
  minuteStep={15}
  format24h={true}
/>`}
            id="timepicker"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <TimePicker
              label="Time (5 min step)"
              value={time}
              onChange={setTime}
              minuteStep={5}
            />
            <TimePicker
              label="Time (15 min step)"
              minuteStep={15}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="With Error"
              error="Time is required"
            />
            <TimePicker
              label="Disabled"
              disabled
              value="14:30"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{time || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Combined Example */}
      <DemoCard title="Combined Date & Time">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Example of using both pickers together for datetime selection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Event Date"
              value={date}
              onChange={setDate}
              required
            />
            <TimePicker
              label="Event Time"
              value={time}
              onChange={setTime}
              required
            />
          </div>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">
              Selected: {date ? date.toLocaleDateString() : '—'} at {time || '—'}
            </p>
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
                <td className="py-2 pr-4">DatePicker</td>
                <td className="py-2 pr-4">dateFormat, locale (en/ru), placeholder</td>
                <td className="py-2">Date | string</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">TimePicker</td>
                <td className="py-2 pr-4">minuteStep (1/5/10/15/30), format24h</td>
                <td className="py-2">string (HH:mm)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
