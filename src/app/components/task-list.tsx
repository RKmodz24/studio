
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Gamepad2, Loader2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import Image from "next/image";

type TaskListProps = {
  tasks: Task[];
  onCompleteTask: (taskId: string, reward: number, type: Task['type'], offerId?: string) => void;
  listId: string;
};

const TaskIcon = ({ task }: { task: Task }) => {
    if (task.icon) {
        return <Image src={task.icon} alt={`${task.title} icon`} width={40} height={40} className="rounded-lg" data-ai-hint="app icon" />;
    }
    switch (task.type) {
        case 'game':
            return <Gamepad2 className="h-6 w-6 text-primary" />;
        case 'offer':
            return <Download className="h-6 w-6 text-primary" />;
        default:
            return <CircleDollarSign className="h-6 w-6 text-yellow-500" />;
    }
};


const TaskList = ({ tasks, onCompleteTask, listId }: TaskListProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={`${listId}-${task.id}`}
          className={cn(
            "transition-all duration-300",
            task.status === 'completed' 
              ? "opacity-50 -translate-x-full" 
              : "opacity-100 translate-x-0",
             task.id === "1" ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-800/30 dark:to-orange-800/30 border-primary/20 shadow-lg" : "shadow-sm"
          )}
        >
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <TaskIcon task={task} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                 {task.description && <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>}
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onCompleteTask(task.id, task.reward, task.type, task.offerId)}
              disabled={task.status === 'processing'}
              className="min-w-[80px]"
            >
              {task.status === 'processing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {task.type === 'game' ? 'Play' : 'Earn'}
                  {task.reward > 0 && (
                    <span className="ml-2 flex items-center">
                      <CircleDollarSign className="mr-1 h-4 w-4" />
                      {task.reward.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
