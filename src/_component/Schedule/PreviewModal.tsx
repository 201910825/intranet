import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Schedule {
  id: string
  title: string
  date: string // YYYY-MM-DD
  startTime?: Date // HH:mm
  endTime?: Date // HH:mm
  description?: string
  imageUrls?: string[]
}

interface PreviewModalProps {
  schedule: Schedule;
  onClose: () => void;
}

export function PreviewModal({ schedule, onClose }: PreviewModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{schedule.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">
              {schedule.startTime && schedule.endTime ? (
                `${schedule.startTime} - ${schedule.endTime}`
              ) : '시간 미지정'}
            </p>
          </div>

          {schedule.description && (
            <div>
              <p className="text-gray-800">{schedule.description}</p>
            </div>
          )}

          {schedule.imageUrls && (
            <div>
              {schedule.imageUrls.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt="일정 이미지" 
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}