import { useState } from 'react'
import { Tooltip } from './Tooltip'
import { Info } from 'lucide-react'

export const ManagerForm = () => {
  const [formValues, setFormValues] = useState({
    input: '',
    inputExamples: '',
    goal: '',
    instructions: '',
    specialistInput: '',
    specialistInputExamples: '',
    specialistOutput: '',
    specialistOutputExample: '',
    output: '',
    outputExamples: '',
    constraints: '',
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [xmlPreview, setXmlPreview] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const buildXmlFromForm = () => {
    const escapeXml = (value = '') =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    const multilineToItems = (value = '', itemTag, indent = '    ') => {
      const rawLines = value.split(/\r?\n/)
      const items = []
      let currentBlock = []
      let inBlock = false

      for (const raw of rawLines) {
        const trimmed = raw.trim()
        if (!trimmed) continue

        const startsWithStar = trimmed.startsWith('*')
        const endsWithStar = trimmed.endsWith('*')

        // Single-line *block*
        if (!inBlock && startsWithStar && endsWithStar && trimmed.length > 1) {
          const inner = trimmed.slice(1, -1).trim()
          if (inner) items.push(inner)
          continue
        }

        // Start of multi-line *block
        if (!inBlock && startsWithStar) {
          const withoutStart = trimmed.slice(1)
          currentBlock.push(withoutStart)
          inBlock = true

          // Handle edge case: starts and ends with * on different sides in same line
          if (endsWithStar && withoutStart.trim().length > 0) {
            const lastIndex = currentBlock.length - 1
            currentBlock[lastIndex] = currentBlock[lastIndex].slice(0, -1).trimEnd()
            items.push(currentBlock.join('\n'))
            currentBlock = []
            inBlock = false
          }
          continue
        }

        // End of multi-line block ...text*
        if (inBlock && endsWithStar) {
          const withoutEnd = trimmed.slice(0, -1)
          currentBlock.push(withoutEnd)
          items.push(currentBlock.join('\n'))
          currentBlock = []
          inBlock = false
          continue
        }

        if (inBlock) {
          currentBlock.push(trimmed)
        } else {
          items.push(trimmed)
        }
      }

      // If block was never closed, treat accumulated lines as one item
      if (inBlock && currentBlock.length) {
        items.push(currentBlock.join('\n'))
      }

      if (items.length === 0) return ''

      return items
        .map((text) => `${indent}<${itemTag}>${escapeXml(text)}</${itemTag}>`)
        .join('\n')
    }

    const inputExamplesXml = multilineToItems(formValues.inputExamples, 'example', '    ')
    const instructionsXml = multilineToItems(formValues.instructions, 'instruction', '  ')
    const specialistInputExamplesXml = multilineToItems(
      formValues.specialistInputExamples,
      'example',
      '    '
    )
    const specialistOutputExamplesXml = multilineToItems(
      formValues.specialistOutputExample,
      'example',
      '    '
    )
    const outputExamplesXml = multilineToItems(formValues.outputExamples, 'example', '    ')
    const constraintsXml = multilineToItems(formValues.constraints, 'constraint', '  ')

    const xml = `
<inputs>
  <input>${escapeXml(formValues.input)}</input>
  <examples>
${inputExamplesXml || '    '}
  </examples>
</inputs>
<goal>${escapeXml(formValues.goal)}</goal>
<instructions>
${instructionsXml || ''}
</instructions>
<specialist>
  <input-payload>${escapeXml(formValues.specialistInput)}</input-payload>
  <input-examples>
${specialistInputExamplesXml || '    '}
  </input-examples>
  <output-payload>${escapeXml(formValues.specialistOutput)}</output-payload>
  <output-examples>
${specialistOutputExamplesXml || '    '}
  </output-examples>
</specialist>
<outputs>
  <output>${escapeXml(formValues.output)}</output>
  <examples>
${outputExamplesXml || '    '}
  </examples>
</outputs>
<constraints>
${constraintsXml || ''}
</constraints>
`.trim()

    return xml
  }

  const openPreviewModal = () => {
    const xml = buildXmlFromForm()
    setXmlPreview(xml)
    setIsModalOpen(true)
  }

  const handleConfirmCopy = async () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(xmlPreview)
        setIsModalOpen(false)
      } catch (error) {
        console.error('Failed to copy text', error)
      }
    }
  }

  return (
    <form
      className="max-w-3xl mx-auto space-y-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Build an XML Manager
        </h1>
        <p className="text-sm text-slate-600">
          Define the inputs, specialist payloads, outputs, and constraints to generate an
          XML template you can copy into your system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Input
            <Tooltip content="Define what input to expect from the Supervisor.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="input"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.input}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Input Examples
            <Tooltip content="Try for 2 examples of the input. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="inputExamples"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.inputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Goal
            <Tooltip content="A single sentence goal statment explaining purpose the task.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="goal"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.goal}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Instructions
            <Tooltip content="Instructions/steps on how to complete the task. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="instructions"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.instructions}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Specialist Input
            <Tooltip content="Define what the manager should give to the specialist during the task execution.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="specialistInput"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.specialistInput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Specialist Input Examples
            <Tooltip content="Try for 1 example of the input. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="specialistInputExamples"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.specialistInputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Specialist Output
            <Tooltip content="Define what the manager should expect from the specialist after the task execution.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="specialistOutput"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.specialistOutput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Specialist Output Example
            <Tooltip content="Try for 1 example of the output. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="specialistOutputExample"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.specialistOutputExample}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Output
            <Tooltip content="Define what the manager should send to the Supervisor after the task execution.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="output"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.output}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Output Examples
            <Tooltip content="Try for 2 examples of the output. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="outputExamples"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.outputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Constraints
            <Tooltip content="Constraints on the task. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="constraints"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.constraints}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={openPreviewModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Submit
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-3xl w-full mx-4 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Review XML</h2>
            <textarea
              className="border border-slate-200 rounded-lg px-3 py-2 min-h-[260px] font-mono text-sm w-full bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
              value={xmlPreview}
              onChange={(event) => setXmlPreview(event.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={handleConfirmCopy}
              >
                Copy to clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
