package taskmanagementsystem.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import taskmanagementsystem.dto.PageResponse;
import taskmanagementsystem.dto.TaskRequest;
import taskmanagementsystem.dto.TaskResponse;
import taskmanagementsystem.exception.ApiException;
import taskmanagementsystem.exception.ResourceNotFoundException;
import taskmanagementsystem.model.Priority;
import taskmanagementsystem.model.Task;
import taskmanagementsystem.model.User;
import taskmanagementsystem.repository.TaskRepository;
import taskmanagementsystem.repository.UserRepository;
import taskmanagementsystem.service.TaskService;

import java.util.Set;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {

    // Whitelist of columns clients may sort by, so a request like
    // ?sortBy=user.password can't be used to probe/sort on arbitrary fields.
    private static final Set<String> SORTABLE_FIELDS =
            Set.of("id", "task", "priority", "dueDate", "createdAt", "updatedAt", "completed");

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskResponse createTask(TaskRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, Id: " + userId));

        Task task = new Task();
        task.setTask(request.task());
        task.setDetails(request.details());
        task.setPriority(request.priority() != null ? request.priority() : Priority.MEDIUM);
        task.setDueDate(request.dueDate());
        task.setCompleted(false);
        task.setUser(user);

        Task saved = taskRepository.save(task);
        log.info("User {} created task {}", userId, saved.getId());
        return TaskResponse.from(saved);
    }

    @Override
    public TaskResponse getTaskById(Integer taskId, Long requesterId) {
        return TaskResponse.from(findOwnedTask(taskId, requesterId));
    }

    @Override
    public PageResponse<TaskResponse> getTasks(Long userId, Boolean completed, Priority priority, String keyword,
                                                int page, int size, String sortBy, String direction) {
        String safeSortBy = SORTABLE_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort.Direction safeDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(safeDirection, safeSortBy));

        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Page<Task> result = taskRepository.search(userId, completed, priority, normalizedKeyword, pageable);
        return PageResponse.from(result.map(TaskResponse::from));
    }

    @Override
    public TaskResponse updateTask(TaskRequest request, Integer id, Long requesterId) {
        Task task = findOwnedTask(id, requesterId);
        task.setTask(request.task());
        task.setDetails(request.details());
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        task.setDueDate(request.dueDate());

        Task updated = taskRepository.save(task);
        log.info("User {} updated task {}", requesterId, id);
        return TaskResponse.from(updated);
    }

    @Override
    public void deleteTask(Integer id, Long requesterId) {
        Task task = findOwnedTask(id, requesterId);
        taskRepository.delete(task);
        log.info("User {} deleted task {}", requesterId, id);
    }

    @Override
    public TaskResponse doneTask(Integer id, Long requesterId) {
        Task task = findOwnedTask(id, requesterId);
        task.setCompleted(true);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Override
    public TaskResponse pendingTask(Integer id, Long requesterId) {
        Task task = findOwnedTask(id, requesterId);
        task.setCompleted(false);
        return TaskResponse.from(taskRepository.save(task));
    }

    /**
     * Loads a task and verifies it actually belongs to the requester (the
     * user id taken from the verified JWT, not client input). Every
     * mutating/read operation on a single task goes through this.
     */
    private Task findOwnedTask(Integer taskId, Long requesterId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found, Id: " + taskId));

        if (task.getUser() == null || !task.getUser().getId().equals(requesterId)) {
            log.warn("User {} attempted to access task {} owned by another user", requesterId, taskId);
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to access this task");
        }

        return task;
    }
}
