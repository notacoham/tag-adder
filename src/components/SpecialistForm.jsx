import { useState } from 'react'
import { Tooltip } from './Tooltip'
import { Info } from 'lucide-react'
import { XmlPreviewModal } from './XmlPreviewModal'

export const SpecialistForm = () => {
  const [formValues, setFormValues] = useState({
    input: '',
    inputExamples: '',
    goal: '',
    instructions: '',
    toolInput: '',
    toolInputExamples: '',
    toolOutput: '',
    toolOutputExample: '',
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

        if (!inBlock && startsWithStar && endsWithStar && trimmed.length > 1) {
          const inner = trimmed.slice(1, -1).trim()
          if (inner) items.push(inner)
          continue
        }

        if (!inBlock && startsWithStar) {
          const withoutStart = trimmed.slice(1)
          currentBlock.push(withoutStart)
          inBlock = true

          if (endsWithStar && withoutStart.trim().length > 0) {
            const lastIndex = currentBlock.length - 1
            currentBlock[lastIndex] = currentBlock[lastIndex].slice(0, -1).trimEnd()
            items.push(currentBlock.join('\n'))
            currentBlock = []
            inBlock = false
          }
          continue
        }

        if (inBlock && endsWithStar) {
          const withoutEnd = trimmed.slice(0, -1)
          currentBlock.push(withoutEnd)
          currentBlock.length && items.push(currentBlock.join('\n'))
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
    const toolInputExamplesXml = multilineToItems(
      formValues.toolInputExamples,
      'example',
      '    '
    )
    const toolOutputExamplesXml = multilineToItems(
      formValues.toolOutputExample,
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
<tool>
  <input-payload>${escapeXml(formValues.toolInput)}</input-payload>
  <input-examples>
${toolInputExamplesXml || '    '}
  </input-examples>
  <output-payload>${escapeXml(formValues.toolOutput)}</output-payload>
  <output-examples>
${toolOutputExamplesXml || '    '}
  </output-examples>
</tool>
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
          Build an XML Specialist
        </h1>
        <p className="text-sm text-slate-600">
          Define the inputs, tool payloads, outputs, and constraints to generate an
          XML template you can copy into your system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Input
            <Tooltip content="Define what input to expect from the tool manager.">
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
            <Tooltip content="A single sentence goal statement explaining the purpose of the tool.">
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
            <Tooltip content="Instructions/steps on how the tool should complete the task. Use * to define multi-line instructions.">
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
            Tool Input
            <Tooltip content="Define what the manager should give to the tool during the task execution.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="toolInput"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.toolInput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Tool Input Examples
            <Tooltip content="Try for 1 example of the tool input. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="toolInputExamples"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.toolInputExamples}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Tool Output
            <Tooltip content="Define what the manager should expect from the tool after the task execution.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <input
            type="text"
            name="toolOutput"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.toolOutput}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Tool Output Example
            <Tooltip content="Try for 1 example of the tool output. Use * to define multi-line instructions.">
              <Info className="w-4 h-4 text-slate-400" />
            </Tooltip>
          </span>
          <textarea
            name="toolOutputExample"
            className="px-3 py-2 min-h-[80px] rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            value={formValues.toolOutputExample}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium flex items-center gap-1 text-slate-900 text-sm">
            Output
            <Tooltip content="Define what the manager should send to the Supervisor after the tool execution.">
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
            <Tooltip content="Constraints on the tool. Use * to define multi-line instructions.">
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

      <XmlPreviewModal
        isOpen={isModalOpen}
        xmlPreview={xmlPreview}
        onChange={(event) => setXmlPreview(event.target.value)}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCopy}
      />
    </form>
  )
}