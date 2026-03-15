import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonsByClass } from '@/hooks/useLessons'
import { useCreateAssessment } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { AssessmentType } from '@/types/entities'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
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

type DraftComponent = {
  title: string
  isScorable: boolean
  maxScore: number
  notes: string
}

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
  const [components, setComponents] = useState<DraftComponent[]>([])

  const handleSubmit = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Title is required')
      return
    }

    const normalizedComponents = components.map((component) => ({
      title: component.title.trim(),
      isScorable: component.isScorable,
      maxScore: component.maxScore,
      notes: component.notes.trim(),
    }))

    if (normalizedComponents.some((component) => !component.title)) {
      toast.error('Component title is required')
      return
    }

    if (
      normalizedComponents.some(
        (component) => component.isScorable && (!Number.isFinite(component.maxScore) || component.maxScore <= 0),
      )
    ) {
      toast.error('Scorable component max score must be greater than 0')
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
        components: normalizedComponents.map((component) => ({
          title: component.title,
          isScorable: component.isScorable,
          maxScore: component.isScorable ? component.maxScore : undefined,
          notes: component.notes || undefined,
        })),
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

          <div className="space-y-3 border rounded-md p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Components (optional)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Add subassignments/components like Listening, Reading, Speaking.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setComponents((prev) => [
                    ...prev,
                    { title: '', isScorable: true, maxScore: 10, notes: '' },
                  ])
                }
              >
                <Plus className="h-4 w-4" />
                Add Component
              </Button>
            </div>

            {components.length > 0 && (
              <div className="space-y-3">
                {components.map((component, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Component Title</Label>
                        <Input
                          value={component.title}
                          onChange={(e) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, title: e.target.value } : item,
                              ),
                            )
                          }
                          placeholder="e.g. Listening Part 1"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Mode</Label>
                        <Select
                          value={component.isScorable ? 'score' : 'comment-only'}
                          onValueChange={(value) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      isScorable: value === 'score',
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="score">Score + Comment</SelectItem>
                            <SelectItem value="comment-only">Comment only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Component Max Score</Label>
                        <Input
                          type="number"
                          min={0.5}
                          step={0.5}
                          disabled={!component.isScorable}
                          value={component.maxScore}
                          onChange={(e) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, maxScore: Number(e.target.value) } : item,
                              ),
                            )
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Notes (optional)</Label>
                        <Input
                          value={component.notes}
                          onChange={(e) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, notes: e.target.value } : item,
                              ),
                            )
                          }
                          placeholder="Optional guidance"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setComponents((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
