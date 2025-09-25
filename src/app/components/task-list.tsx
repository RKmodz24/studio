
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Gem, PlayCircle, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { copy } from "@/lib/locales";

type TaskListProps = {
  tasks: Task[];
  onCompleteTask: (taskId: string, reward: number, type: Task['type']) => void;
};

const TaskList = ({ tasks, onCompleteTask }: TaskListProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={cn(
            "transition-all duration-500 ease-out",
            task.completed ? "opacity-50" : "opacity-100"
          )}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  task.completed ? "bg-gray-200 dark:bg-gray-700" : "bg-primary/10"
              )}>
                {task.type === 'ad' ? (
                  <PlayCircle className={cn("h-6 w-6", task.completed ? "text-gray-500" : "text-primary")} />
                ) : task.type === 'game' ? (
                    <Gamepad2 className={cn("h-6 w-6", task.completed ? "text-gray-500" : "text-primary")} />
                ) : (
                  <Gem className={cn("h-6 w-6", task.completed ? "text-gray-500" : "text-primary")} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</p>
                <div className="flex items-center text-sm text-yellow-500">
                  <span>+{task.reward}</span>
                  <Gem className="ml-1 h-3 w-3" />
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant={task.completed ? "secondary" : "default"}
              onClick={() => onCompleteTask(task.id, task.reward, task.type)}
              disabled={task.completed}
              className="w-28"
            >
              {task.completed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {copy.tasks.done}
                </>
              ) : (
                task.type === 'game' ? copy.tasks.play : copy.tasks.complete
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
