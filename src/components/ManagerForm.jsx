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
    <form className="max-w-3xl mx-auto p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Input
            <Tooltip content="Placeholder help text for Input">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="input"
            className="border rounded-md px-3 py-2"
            value={formValues.input}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Input Examples
            <Tooltip content="Placeholder help text for Input Examples">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="inputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.inputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Goal
            <Tooltip content="Placeholder help text for Goal">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="goal"
            className="border rounded-md px-3 py-2"
            value={formValues.goal}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Instructions
            <Tooltip content="Placeholder help text for Instructions">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="instructions"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.instructions}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Specialist Input
            <Tooltip content="Placeholder help text for Specialist Input">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="specialistInput"
            className="border rounded-md px-3 py-2"
            value={formValues.specialistInput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Specialist Input Examples
            <Tooltip content="Placeholder help text for Specialist Input Examples">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="specialistInputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.specialistInputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Specialist Output
            <Tooltip content="Placeholder help text for Specialist Output">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="specialistOutput"
            className="border rounded-md px-3 py-2"
            value={formValues.specialistOutput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Specialist Output Example
            <Tooltip content="Placeholder help text for Specialist Output Example">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="specialistOutputExample"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.specialistOutputExample}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Output
            <Tooltip content="Placeholder help text for Output">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="output"
            className="border rounded-md px-3 py-2"
            value={formValues.output}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Output Examples
            <Tooltip content="Placeholder help text for Output Examples">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="outputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.outputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1">
            Constraints
            <Tooltip content="Placeholder help text for Constraints">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </span>
          <textarea
            name="constraints"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.constraints}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={openPreviewModal}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Review XML</h2>
            <textarea
              className="border rounded-md px-3 py-2 min-h-[260px] font-mono text-sm w-full"
              value={xmlPreview}
              onChange={(event) => setXmlPreview(event.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-md border text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
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
