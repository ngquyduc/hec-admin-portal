import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonsByClass } from '@/hooks/useLessons'
import { useCreateAssessment } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { AssessmentType } from '@/types/entities'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/assignments/new')({
  component: NewAssignmentPage,
})

const ASSESSMENT_TYPES = Object.keys(ASSESSMENT_TYPE_LABELS) as AssessmentType[]

function NewAssignmentPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lessons = [] } = useLessonsByClass(classId)
  const createAssessment = useCreateAssessment()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<AssessmentType>('classwork')
  const [maxScore, setMaxScore] = useState<number>(10)
  const [lessonId, setLessonId] = useState<string>('none')
  const [dueAt, setDueAt] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Title is required')
      return
    }

    try {
      await createAssessment.mutateAsync({
        classId,
        lessonId: lessonId === 'none' ? undefined : lessonId,
        type,
        title: trimmedTitle,
        maxScore,
        dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
        notes: notes.trim() || undefined,
      })
      toast.success('Assignment created successfully!')
      navigate({ to: '/classes/$classId', params: { classId } })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create assignment.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class
        </Button>
        <h1 className="text-3xl font-bold">Add New Assignment</h1>
        <p className="text-muted-foreground mt-1">Create an assignment for this class</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Homework Unit 3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as AssessmentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_TYPES.map((assessmentType) => (
                    <SelectItem key={assessmentType} value={assessmentType}>
                      {ASSESSMENT_TYPE_LABELS[assessmentType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Max Score</Label>
              <Input
                type="number"
                min={1}
                step={0.5}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Related Lesson (optional)</Label>
              <Select value={lessonId} onValueChange={setLessonId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No lesson</SelectItem>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Due At (optional)</Label>
              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any instructions or notes for this assignment"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createAssessment.isPending}
            >
              {createAssessment.isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
