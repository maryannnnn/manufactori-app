'use client'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { RichTextFieldClientProps } from 'payload'

import { RichEditor } from '@/components/RichEditor'

type TiptapFieldProps = RichTextFieldClientProps & {
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  placeholder?: string
}

export const TiptapField: React.FC<TiptapFieldProps> = ({
  field,
  path,
  readOnly,
  headingLevels = [2, 3, 4],
  placeholder,
}) => {
  const { value, setValue, showError, errorMessage } = useField<object>({
    path: path || field.name,
  })

  return (
    <div className="field-type rich-text-field tiptap-field">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldDescription description={field.admin?.description} path={path} />
      <RichEditor
        headingLevels={headingLevels}
        onChange={setValue}
        placeholder={placeholder}
        readOnly={readOnly || Boolean(field.admin?.readOnly)}
        value={value}
      />
      <FieldError message={errorMessage} showError={showError} />
    </div>
  )
}
