
interface TimeBlock {
  id: number;
  startTime: string | null;
  endTime: string | null;
}

interface ScheduleBoxProps {
  block: TimeBlock;
  timeOptions: string[];
  onStartTimeChange: (id: number, value: string) => void;
  onEndTimeChange: (id: number, value: string) => void;
}

const ScheduleBox = ({ block, timeOptions, onStartTimeChange, onEndTimeChange }:ScheduleBoxProps) => {
  return (
    <div key={block.id} className="flex justify-evenly border border-gray-400 rounded-lg w-full p-2">
      <select
        className="w-2/5"
        onChange={(e) => onStartTimeChange(block.id, e.target.value)}
      >
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <h2>~</h2>
      <select
        className="w-2/5"
        onChange={(e) => onEndTimeChange(block.id, e.target.value)}
        disabled={!block.startTime}
      >
        {timeOptions
          .filter(time => !block.startTime || time > block.startTime)
          .map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
      </select>
    </div>
  );
}

export default ScheduleBox;