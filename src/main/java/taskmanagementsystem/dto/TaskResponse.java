package taskmanagementsystem.dto;

import taskmanagementsystem.model.Priority;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * What we send back to the client. Never exposes the User entity (avoids
 * leaking other users' data and avoids lazy-loading serialization issues),
 * and adds a computed "overdue" flag so the frontend doesn't need to
 * duplicate that date logic itself.
 */
public record TaskResponse(
        Integer id,
        String task,
        String details,
        Boolean completed,
        Priority priority,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean overdue
) {
    public static TaskResponse from(taskmanagementsystem.model.Task task) {
        boolean isOverdue = task.getDueDate() != null
                && !Boolean.TRUE.equals(task.getCompleted())
                && task.getDueDate().isBefore(LocalDate.now());

        return new TaskResponse(
                task.getId(),
                task.getTask(),
                task.getDetails(),
                task.getCompleted(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                isOverdue
        );
    }
}
