import React from 'react'

/**
 * Visual invitation only. Not a form, link, or submit control.
 */
export const AskQuestionPlaceholder: React.FC = () => {
  return (
    <div className="mt-10 max-w-[72ch] border-t border-border pt-8">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        Have a question about this topic?
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Send your question to Maryan Polyak. Relevant questions may be answered in a future expert
        discussion.
      </p>
    </div>
  )
}
