import CreateQuestionForm from '@/components/modules/AddQuestion/AddQuestion'
import React, { Suspense } from 'react'

export default function CreateQuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading create question form...
        </div>
      }
    >
      <CreateQuestionForm />
    </Suspense>
  )
}
