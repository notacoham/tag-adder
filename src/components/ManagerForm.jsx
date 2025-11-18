import { useState } from 'react'

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
      const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (lines.length === 0) return ''

      return lines
        .map((line) => `${indent}<${itemTag}>${escapeXml(line)}</${itemTag}>`)
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
          <span className="font-medium">Input</span>
          <input
            type="text"
            name="input"
            className="border rounded-md px-3 py-2"
            value={formValues.input}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Input Examples</span>
          <textarea
            name="inputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.inputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Goal</span>
          <input
            type="text"
            name="goal"
            className="border rounded-md px-3 py-2"
            value={formValues.goal}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Instructions</span>
          <textarea
            name="instructions"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.instructions}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Specialist Input</span>
          <input
            type="text"
            name="specialistInput"
            className="border rounded-md px-3 py-2"
            value={formValues.specialistInput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Specialist Input Examples</span>
          <textarea
            name="specialistInputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.specialistInputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Specialist Output</span>
          <input
            type="text"
            name="specialistOutput"
            className="border rounded-md px-3 py-2"
            value={formValues.specialistOutput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Specialist Output Example</span>
          <textarea
            name="specialistOutputExample"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.specialistOutputExample}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Output</span>
          <input
            type="text"
            name="output"
            className="border rounded-md px-3 py-2"
            value={formValues.output}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Output Examples</span>
          <textarea
            name="outputExamples"
            className="border rounded-md px-3 py-2 min-h-[80px]"
            value={formValues.outputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Constraints</span>
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
