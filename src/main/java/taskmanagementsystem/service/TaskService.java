package taskmanagementsystem.service;

import taskmanagementsystem.dto.PageResponse;
import taskmanagementsystem.dto.TaskRequest;
import taskmanagementsystem.dto.TaskResponse;
import taskmanagementsystem.model.Priority;

public interface TaskService {

    TaskResponse createTask(TaskRequest request, Long userId);

    TaskResponse getTaskById(Integer taskId, Long requesterId);

    PageResponse<TaskResponse> getTasks(Long userId, Boolean completed, Priority priority, String keyword,
                                         int page, int size, String sortBy, String direction);

    TaskResponse updateTask(TaskRequest request, Integer id, Long requesterId);

    void deleteTask(Integer id, Long requesterId);

    TaskResponse doneTask(Integer id, Long requesterId);

    TaskResponse pendingTask(Integer id, Long requesterId);
}
