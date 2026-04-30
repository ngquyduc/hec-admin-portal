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
  mode: 'score-comment' | 'score-only' | 'comment-only'
  maxScore: number
  description: string
}

function NewAssignmentPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lessons = [] } = useLessonsByClass(classId)
  const createAssessment = useCreateAssessment()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<AssessmentType>('in-class')
  const [maxScore, setMaxScore] = useState<number>(9)
  const [lessonId, setLessonId] = useState<string>('none')
  const [dueAt, setDueAt] = useState('')
  const [description, setDescription] = useState('')
  const [components, setComponents] = useState<DraftComponent[]>([])

  const handleSubmit = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Title is required')
      return
    }

    const normalizedComponents = components.map((component) => ({
      title: component.title.trim(),
      isScorable: component.mode !== 'comment-only',
      maxScore: component.maxScore,
      description: component.description.trim(),
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
        notes: description.trim() || undefined,
        components: normalizedComponents.map((component) => ({
          title: component.title,
          isScorable: component.isScorable,
          maxScore: component.isScorable ? component.maxScore : undefined,
          notes: component.description || undefined,
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
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Homework Unit 3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Type <span className="text-red-500">*</span>
              </Label>
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
              <Label>
                Max Score <span className="text-red-500">*</span>
              </Label>
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
                      <span className="font-semibold">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {' '}
                        — {new Date(lesson.startTime).toLocaleString()}
                      </span>
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
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any instructions or description for this assignment"
            />
          </div>

          <div className="space-y-3 border rounded-md p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Sub-assignment (optional)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Add sub-assignments like Listening, Reading, Speaking.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setComponents((prev) => [
                    ...prev,
                    { title: '', mode: 'score-comment', maxScore: 9, description: '' },
                  ])
                }
              >
                <Plus className="h-4 w-4" />
                Add Sub-assignment
              </Button>
            </div>

            {components.length > 0 && (
              <div className="space-y-3">
                {components.map((component, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>
                          Sub-assignment Title <span className="text-red-500">*</span>
                        </Label>
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
                        <Label>
                          Mode <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={component.mode}
                          onValueChange={(value) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      mode: value as DraftComponent['mode'],
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
                            <SelectItem value="score-comment">Score & Comment</SelectItem>
                            <SelectItem value="score-only">Score only</SelectItem>
                            <SelectItem value="comment-only">Comment only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {component.mode !== 'comment-only' && (
                        <div className="space-y-1.5">
                          <Label>
                            Sub-assignment Max Score <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            min={0.5}
                            step={0.5}
                            value={component.maxScore}
                            onChange={(e) =>
                              setComponents((prev) =>
                                prev.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, maxScore: Number(e.target.value) }
                                    : item,
                                ),
                              )
                            }
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label>Description (optional)</Label>
                        <Input
                          value={component.description}
                          onChange={(e) =>
                            setComponents((prev) =>
                              prev.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, description: e.target.value } : item,
                              ),
                            )
                          }
                          placeholder="Optional description"
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
