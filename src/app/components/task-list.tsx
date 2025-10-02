
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Gamepad2, Loader2, Download, ChevronRight, Gift } from "lucide-react";
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
        case 'withdraw':
            return <Gift className="h-6 w-6 text-primary" />;
        default:
            return <CircleDollarSign className="h-6 w-6 text-yellow-500" />;
    }
};

const TaskList = ({ tasks, onCompleteTask, listId }: TaskListProps) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        if (task.type === 'withdraw') {
            return (
                <Card key={`${listId}-${task.id}`} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                    <CardContent className="flex items-center justify-between p-4">
                         <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Gift className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold">{task.title}</p>
                                <p className="text-xs opacity-90">Instant withdrawal</p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onCompleteTask(task.id, task.reward, task.type, task.offerId)}
                            className="bg-white/90 text-yellow-600 hover:bg-white"
                        >
                            Withdraw
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )
        }
        return (
            <Card
            key={`${listId}-${task.id}`}
            className="transition-all duration-300 shadow-sm hover:shadow-md"
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
                    variant="outline"
                    onClick={() => onCompleteTask(task.id, task.reward, task.type, task.offerId)}
                    disabled={task.status === 'processing'}
                    className="flex flex-col h-auto px-3 py-1 border-primary/50 text-primary"
                >
                {task.status === 'processing' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <span className="font-bold text-xs">Earn</span>
                        <div className="flex items-center text-xs">
                            <CircleDollarSign className="mr-1 h-3 w-3" />
                            <span>{task.reward.toLocaleString()}</span>
                        </div>
                    </>
                )}
                </Button>
            </CardContent>
            </Card>
        )
      })}
    </div>
  );
};

export default TaskList;

