
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleDollarSign, PlayCircle, Gamepad2, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { copy } from "@/lib/locales";

type TaskListProps = {
  tasks: Task[];
  onCompleteTask: (taskId: string, reward: number, type: Task['type']) => void;
  listId: string;
};

const TaskList = ({ tasks, onCompleteTask, listId }: TaskListProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={`${listId}-${task.id}`}
          className={cn(
            "transition-all duration-500 ease-in-out",
            task.status === 'completed'
              ? "opacity-0 scale-95 -translate-y-4 max-h-0 py-0"
              : "opacity-100 scale-100 translate-y-0 max-h-32",
            task.type === 'game' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 shadow-md' : ''
          )}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  task.status !== 'incomplete' ? "bg-gray-200 dark:bg-gray-700" : (task.type === 'game' ? "bg-yellow-100 dark:bg-yellow-900/50" : "bg-primary/10")
              )}>
                {task.type === 'ad' ? (
                  <PlayCircle className={cn("h-6 w-6", task.status !== 'incomplete' ? "text-gray-500" : "text-primary")} />
                ) : task.type === 'game' ? (
                    <Gamepad2 className={cn("h-6 w-6", task.status !== 'incomplete' ? "text-gray-500" : "text-yellow-500")} />
                ) : (
                  <CircleDollarSign className={cn("h-6 w-6", task.status !== 'incomplete' ? "text-gray-500" : "text-yellow-500")} />
                )}
              </div>
              <div>
                <p className={cn("font-semibold text-gray-800 dark:text-gray-200", task.type === 'game' && "text-yellow-800 dark:text-yellow-200")}>{task.title}</p>
                <div className="flex items-center text-sm text-yellow-500">
                    {task.reward > 0 && (
                        <>
                            <span>+{task.reward}</span>
                            <CircleDollarSign className="ml-1 h-3 w-3" />
                        </>
                    )}
                    {task.type === 'game' && (
                        <div className="flex items-center text-xs font-semibold text-yellow-600 dark:text-yellow-400 ml-2 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-0.5 rounded-full">
                            <Star className="mr-1 h-3 w-3" />
                            BIG REWARD
                        </div>
                    )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant={task.status !== 'incomplete' ? "secondary" : (task.type === 'game' ? 'default' : 'default')}
              onClick={() => onCompleteTask(task.id, task.reward, task.type)}
              disabled={task.status !== 'incomplete'}
              className={cn("w-28", task.type === 'game' && "bg-yellow-500 hover:bg-yellow-600 text-white")}
            >
              {task.status === 'completed' ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {copy.tasks.done}
                </>
              ) : task.status === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.tasks.processing}
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

    