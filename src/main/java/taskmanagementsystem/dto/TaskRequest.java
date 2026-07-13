package taskmanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import taskmanagementsystem.model.Priority;

import java.time.LocalDate;

/**
 * What the client is allowed to send us when creating/updating a task.
 * Kept separate from the Task entity so the API contract doesn't change
 * every time the persistence model does (and so a client can never set
 * fields like id, user, or timestamps directly).
 */
public record TaskRequest(
        @NotBlank(message = "Task title is required")
        @Size(max = 150, message = "Task title must be under 150 characters")
        String task,

        @Size(max = 1000, message = "Details must be under 1000 characters")
        String details,

        Priority priority,

        LocalDate dueDate
) {
}
